#!/usr/bin/env python3
"""
Higgsfield zarf görselini sınırına kırpıp public/temalar/envelopes/ altına
webp olarak yazar ve kapak ucu yüzdesini ölçer.

Kullanım:
  python3 scripts/envelope-crop.py <input.png> <theme-name>

Çıktı:
  public/temalar/envelopes/<theme>.webp
  stdout: w h flap_tip_percent

Algılama:
  - Köşe pikselleri arka plan referansı.
  - Otsu eşiği ile zarf maskesi → bbox. Aspect dikey değilse düşük eşiğe geç.
  - Kapak ucu: kırpılmış görselde üst kısımdan FLAP rengi referans alınır,
    aşağı tarayıp ilk olarak FLAP renginden yeterince uzaklaşan satır bulunur.
"""
import os
import sys

import numpy as np
from PIL import Image


def otsu_threshold(values: np.ndarray) -> float:
    flat = values.ravel().astype(np.float32)
    hi = float(flat.max())
    if hi <= 0:
        return 0.0
    hist, edges = np.histogram(flat, bins=256, range=(0, hi + 1))
    centers = (edges[:-1] + edges[1:]) / 2.0
    total = flat.size
    sum_total = (centers * hist).sum()
    weight_b = 0.0
    sum_b = 0.0
    max_var = -1.0
    threshold = 0.0
    for i in range(256):
        weight_b += hist[i]
        if weight_b == 0:
            continue
        weight_f = total - weight_b
        if weight_f == 0:
            break
        sum_b += centers[i] * hist[i]
        mean_b = sum_b / weight_b
        mean_f = (sum_total - sum_b) / weight_f
        var = weight_b * weight_f * (mean_b - mean_f) ** 2
        if var > max_var:
            max_var = var
            threshold = centers[i]
    return float(threshold)


def find_bbox(dist: np.ndarray, thr: float) -> tuple[int, int, int, int] | None:
    mask = dist > thr
    if not mask.any():
        return None
    H, W = mask.shape
    row_count = mask.sum(axis=1)
    col_count = mask.sum(axis=0)
    rows = np.where(row_count > W * 0.05)[0]
    cols = np.where(col_count > H * 0.05)[0]
    if rows.size == 0 or cols.size == 0:
        return None
    return int(rows[0]), int(rows[-1]), int(cols[0]), int(cols[-1])


def main() -> None:
    if len(sys.argv) != 3:
        print("usage: envelope-crop.py <input.png> <theme>", file=sys.stderr)
        sys.exit(1)

    src, theme = sys.argv[1], sys.argv[2]
    im = Image.open(src).convert("RGB")
    arr = np.asarray(im, dtype=np.float32)
    H, W = arr.shape[:2]

    def patch(y, x):
        return arr[max(0, y - 1):y + 2, max(0, x - 1):x + 2].mean(axis=(0, 1))

    corners = np.stack([patch(5, 5), patch(5, W - 6), patch(H - 6, 5), patch(H - 6, W - 6)])
    bg = corners.mean(axis=0)
    dist = np.linalg.norm(arr - bg, axis=2)

    otsu = otsu_threshold(dist)
    bbox = None
    used_thr = None
    for thr in (otsu, otsu * 0.6, 22.0, 14.0, 8.0):
        bb = find_bbox(dist, thr)
        if bb is None:
            continue
        top, bottom, left, right = bb
        h, w = bottom - top, right - left
        if h < 200 or w < 200:
            continue
        if h / max(w, 1) < 0.95:
            continue
        bbox = bb
        used_thr = thr
        break
    if bbox is None:
        sys.exit("error: could not detect envelope bbox at any threshold")

    top, bottom, left, right = bbox
    crop = im.crop((left, top, right + 1, bottom + 1))
    w, h = crop.size

    # Kapak ucu — RENK referansı yöntemi:
    # Üst orta bölgeden flap referans rengini al, aşağı tarayıp uzaklaşan ilk
    # satırı bul.
    crop_arr = np.asarray(crop, dtype=np.float32)
    cx = w // 2
    half = max(4, w // 40)

    # Üst %5-%10 dilim → flap orta rengi (köşelerden uzak dur)
    flap_color = crop_arr[int(h * 0.05):int(h * 0.12), max(0, cx - half):cx + half + 1].mean(axis=(0, 1))

    # Orta sütun şeridi (her satırın orta-7 piksel ortalaması)
    col_strip = crop_arr[:, max(0, cx - half):cx + half + 1].mean(axis=1)  # shape (h, 3)
    color_dist = np.linalg.norm(col_strip - flap_color, axis=1)  # (h,)

    # Yumuşat
    k = max(7, h // 80) | 1
    kernel = np.ones(k) / k
    sm = np.convolve(color_dist, kernel, mode="same")

    # %15'ten itibaren ilk olarak büyük uzaklık (flap'tan farklı renk) bulunan satır
    a = max(int(h * 0.12), 8)
    b = min(int(h * 0.75), h - 5)
    tip = None
    threshold_dist = 28.0
    for y in range(a, b):
        if sm[y] > threshold_dist:
            tip = y
            break
    if tip is None:
        # fallback: maksimum uzaklık konumu üst yarıda
        tip = int(sm[a:b].argmax()) + a

    tip_pct = round(tip / h * 100, 1)

    out_dir = "public/temalar/envelopes"
    os.makedirs(out_dir, exist_ok=True)
    out_path = f"{out_dir}/{theme}.webp"
    crop.save(out_path, "WEBP", quality=92, method=6)

    print(f"{w} {h} {tip_pct}")
    print(f"saved: {out_path} (thr={used_thr:.1f}, otsu={otsu:.1f}, flap_color={flap_color.astype(int).tolist()})", file=sys.stderr)


if __name__ == "__main__":
    main()
