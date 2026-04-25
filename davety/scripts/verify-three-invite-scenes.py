from pathlib import Path

from playwright.sync_api import sync_playwright


routes = [
    "scroll",
    "ring-box",
    "glass-dome",
    "book",
    "flower",
    "tray",
    "music-box",
    "butterfly-box",
    "crystal",
    "film",
    "drawer",
    "ribbon-envelope",
    "moonlight",
    "gallery",
    "cube",
    "mailbox",
    "curtain",
    "bottle",
    "mirror",
    "origami",
]

ctas = {
    "scroll": "Mührü Kır",
    "ring-box": "Kutuyu Aç",
    "glass-dome": "Fanusu Kaldır",
    "book": "Kitabı Aç",
    "flower": "Çiçeği Aç",
    "tray": "Örtüyü Aç",
    "music-box": "Müziği Başlat",
    "butterfly-box": "Kelebekleri Sal",
    "crystal": "Kristali Aç",
    "film": "Şeridi Oynat",
    "drawer": "Çekmeceyi Aç",
    "ribbon-envelope": "Kurdeleyi Çöz",
    "moonlight": "Ay Işığını Aç",
    "gallery": "Sergiyi Aç",
    "cube": "Küpü Aç",
    "mailbox": "Postayı Aç",
    "curtain": "Perdeyi Aç",
    "bottle": "Şişeyi Aç",
    "mirror": "Aynayı Uyandır",
    "origami": "Katları Aç",
}

screenshots = {
    "book": Path("/tmp/davety-book-opened.png"),
    "moonlight": Path("/tmp/davety-moonlight-opened.png"),
    "origami": Path("/tmp/davety-origami-opened.png"),
    "scroll": Path("/tmp/davety-scroll-opened.png"),
}

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 720})
    failures: list[str] = []

    for route in routes:
        page.goto(f"http://localhost:3000/{route}", wait_until="networkidle")
        canvas_count = page.locator("canvas").count()
        scene_button = page.get_by_role("button", name=ctas[route])
        if canvas_count != 1 or scene_button.count() != 1:
            failures.append(f"{route}: canvas={canvas_count} button={scene_button.count()}")
            continue

        scene_button.click()
        page.wait_for_timeout(6100)
        settled = page.locator("text=davetiye çıktı").count()
        if settled != 1:
            failures.append(f"{route}: settled_status={settled}")
        if route in screenshots:
            page.screenshot(path=str(screenshots[route]), full_page=False)

    browser.close()

print(f"checked_routes={len(routes)}")
for route, path in screenshots.items():
    print(f"{route}_screenshot={path}")
if failures:
    print("failures=" + "; ".join(failures))
    raise SystemExit(1)
print("failures=0")
