import type { InvitationDoc, HeroData, Block } from "@davety/schema";
import type { CSSProperties } from "react";
import { getBlockView } from "./blocks";
import { FontBoot } from "./fonts/loader";
import { RendererProvider } from "./context";

/**
 * Maps the chosen `theme.cardShape` to the CSS that decorates the outer
 * card silhouette. Sides + bottom always stay flat; only the top varies.
 *
 *   - flat       → square corners (default, modern minimal)
 *   - arch       → soft rounded dome at the top
 *   - tall-arch  → deeper, narrower dome
 *   - rounded    → both top corners rounded with fixed radius
 *   - peaked     → triangular peak (gothic feel)
 *   - chevron    → inverse V notch in the top edge (banner)
 *   - tag        → top corners cut off (luggage-tag silhouette)
 *
 * For backward compatibility we still respect `hero.data.variant === "arch"`
 * when the doc has no explicit `theme.cardShape` set.
 */
export function getCardShapeStyle(doc: InvitationDoc): CSSProperties {
  const explicit = doc.theme.cardShape;
  // Once the user picks any shape (including "flat") in the editor, that
  // wins over the legacy hero.variant fallback. Otherwise selecting "Düz"
  // wouldn't visibly clear a previously-applied dome from a sample doc.
  if (explicit) return shapeCss(explicit);

  // Backward compat, old docs encoded shape inside hero.variant.
  const hero = doc.blocks.find((b) => b.type === "hero") as
    | Block<HeroData>
    | undefined;
  if (hero?.data.variant === "arch") return shapeCss("arch");

  return {};
}

/** Inner padding compensation for shapes that bite into the top edge.
 *  Without this the first block's text + toolbar end up under the clip
 *  cut and the last "+ Blok Ekle" slot inside an overflow-hidden card
 *  gets pushed past the bottom edge. */
export function getCardShapePadding(
  doc: InvitationDoc,
): { paddingTop?: string; paddingBottom?: string } {
  const shape = doc.theme.cardShape;
  switch (shape) {
    case "peaked":
      return { paddingTop: "44px", paddingBottom: "16px" };
    case "chevron":
      return { paddingTop: "36px", paddingBottom: "16px" };
    case "tag":
      return { paddingTop: "36px" };
    case "arch":
      return { paddingTop: "28px" };
    case "tall-arch":
      return { paddingTop: "56px" };
    default:
      return {};
  }
}

/** Per-shape CSS. Exported so the gallery preview component can pick
 *  the same silhouette without re-implementing the mapping. */
export function shapeCss(shape: NonNullable<InvitationDoc["theme"]["cardShape"]>): CSSProperties {
  switch (shape) {
    case "arch":
      return {
        borderTopLeftRadius: "50% 60px",
        borderTopRightRadius: "50% 60px",
      };
    case "tall-arch":
      return {
        borderTopLeftRadius: "50% 110px",
        borderTopRightRadius: "50% 110px",
      };
    case "rounded":
      return {
        borderTopLeftRadius: "44px",
        borderTopRightRadius: "44px",
      };
    case "peaked":
      // Triangular peak, depth scales with card height.
      return {
        clipPath: "polygon(0% 7%, 50% 0%, 100% 7%, 100% 100%, 0% 100%)",
      };
    case "chevron":
      // Inverse-V notch: top corners stay flush, dip in the middle.
      return {
        clipPath: "polygon(0% 0%, 50% 6%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "tag":
      // Luggage tag, top corners cut at 28px.
      return {
        clipPath:
          "polygon(28px 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%, 0 28px)",
      };
    case "flat":
    default:
      return {};
  }
}

export function isArchShape(doc: InvitationDoc): boolean {
  return doc.theme.cardShape === "arch" || doc.theme.cardShape === "tall-arch";
}

/**
 * Top-right'taki floating toolbar'ın clip-path tarafından kırpılmaması
 * için gereken minimum y offset (px). Editor canvas'ında ilk bloğun
 * üstüne yerleştirilen kontrol bar'ını bu kadar aşağı iter, böylece
 * peaked/chevron/tag/arch/tall-arch silüetlerinin köşe kırpması
 * butonları yutmaz. clip-path'siz şekiller (flat/rounded) için 0.
 */
export function getCardShapeTopClipPx(doc: InvitationDoc): number {
  switch (doc.theme.cardShape) {
    case "peaked":
      return 56; // sağ köşe %7 yukarıda + nefes payı
    case "chevron":
      return 8; // sağ köşe tepede, sadece minik default
    case "tag":
      return 44; // sağ köşe 28px diagonal cut + pay
    case "arch":
      return 72; // dome'un alt kenarına kadar
    case "tall-arch":
      return 96;
    default:
      return 0;
  }
}

export interface InvitationViewProps {
  doc: InvitationDoc;
  /** When true each text slot becomes clickable via onFieldSelect. */
  editable?: boolean;
  onFieldSelect?: (blockId: string, fieldId: string) => void;
  className?: string;
  /** Absolute URL to the davety app (for memory/RSVP POST endpoints from consumer apps). */
  publicBase?: string;
  /** Public slug, required for memory/RSVP submit endpoints. */
  slug?: string;
  /** Personalised guest token, when present is forwarded with RSVP submissions. */
  guestToken?: string;
  /** Public share URL of the invitation, embedded in calendar invites. */
  publicUrl?: string;
}

export function InvitationView({
  doc,
  editable = false,
  onFieldSelect,
  className,
  publicBase,
  slug,
  guestToken,
  publicUrl,
}: InvitationViewProps) {
  const startIso = `${doc.meta.weddingDate}T${doc.meta.weddingTime}:00`;
  // Photo-driven hero (photo-top / photo-full) ilk blok ise card-shape
  // paddingTop'unu sıfırla, böylece görsel kart tepesine kadar uzanır.
  // Diğer şekillerin (peaked/chevron/tag) clip-path'i fotoğrafı zaten
  // kırpıyor, yani şekil silüeti korunur ama görselin üstünde boş bg
  // kalmaz. Hero olmayan ilk blok için padding aynı (text bloklar
  // clip'in içine girmesin).
  const firstBlock = doc.blocks[0];
  const firstBlockData = firstBlock?.data as
    | { variant?: string; media?: { url?: string }; photoUrl?: string }
    | undefined;
  const firstHasPhoto = !!(
    firstBlock?.type === "hero" &&
    (firstBlockData?.variant === "photo-top" ||
      firstBlockData?.variant === "photo-full") &&
    (firstBlockData?.media?.url || firstBlockData?.photoUrl)
  );
  const cardPadding = getCardShapePadding(doc);
  const effectivePadding = firstHasPhoto
    ? { ...cardPadding, paddingTop: "0px" }
    : cardPadding;
  return (
    <RendererProvider
      value={{ publicBase, slug, startIso, publicUrl, guestToken }}
    >
      <div
        className={`invitation-canvas overflow-hidden relative ${className ?? ""}`}
        style={{
          background: doc.theme.bgColor,
          color: doc.theme.accentColor,
          ...getCardShapeStyle(doc),
          ...effectivePadding,
        }}
      >
        <FontBoot doc={doc} />

        {/* Card-wide arka plan görseli. Tüm kartı kaplar, blokların
            arkasında durur. Overlay metni okunur tutmak için yarı
            saydam siyah katman (yoğunluk theme.bgImageOverlay'dan,
            0-100). Kart silüeti (clip-path / border-radius) outer
            div'de overflow-hidden olduğu için image silüetin dışına
            taşmaz. Padding outer'a uygulanmış olsa da inset-0
            absolute outer'ın 100%'üne uzanır, content padding kadar
            içeride başlar. */}
        {doc.theme.bgImageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={doc.theme.bgImageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ zIndex: 0 }}
              aria-hidden
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                zIndex: 1,
                background: "#000",
                opacity: (doc.theme.bgImageOverlay ?? 40) / 100,
              }}
              aria-hidden
            />
          </>
        ) : null}

        {/* Content stack image + overlay'in üstünde, z-index ile
            ayrılır. position:relative olmadan z-index çalışmaz. */}
        <div className="relative" style={{ zIndex: 2 }}>
        {doc.blocks
          .filter((b) => b.visible || editable)
          .map((block) => {
            const View = getBlockView(block.type);
            // Spacing on the outer wrapper, not the inner <section>.
            // - Positive values become extra padding around the block so
            //   the inner content gets more breathing room.
            // - Negative values become margins so the block can ride into
            //   its neighbours. We apply margin out here (instead of on
            //   the inner <section>) so the negative reaches the
            //   sibling block instead of getting swallowed by margin
            //   collapse inside this wrapper div.
            const pt = block.style.paddingTop;
            const pb = block.style.paddingBottom;
            // content-visibility:auto ile viewport dışındaki bloklar
            // layout/paint atlanır. 10+ bloklu uzun davetiyelerde scroll
            // smooth, ilk paint daha hızlı. containIntrinsicSize bloğun
            // beklenen yaklaşık yüksekliğini belirtiyor; tam değer değil
            // ama scrollbar zıplaması olmadan tahmin için yeterli.
            const wrapperStyle: React.CSSProperties = {
              opacity: block.visible ? 1 : 0.35,
              paddingTop: pt != null && pt > 0 ? pt : undefined,
              paddingBottom: pb != null && pb > 0 ? pb : undefined,
              marginTop: pt != null && pt < 0 ? pt : undefined,
              marginBottom: pb != null && pb < 0 ? pb : undefined,
              contentVisibility: "auto",
              containIntrinsicSize: "100% 320px",
            };
            return (
              <div
                key={block.id}
                data-block-id={block.id}
                data-block-type={block.type}
                style={wrapperStyle}
              >
                <View
                  block={block}
                  theme={doc.theme}
                  editable={editable}
                  onFieldSelect={
                    onFieldSelect
                      ? (fieldId) => onFieldSelect(block.id, fieldId)
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </RendererProvider>
  );
}

export function renderInvitation(doc: InvitationDoc) {
  return <InvitationView doc={doc} />;
}
