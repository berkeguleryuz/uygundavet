import type {
  EventProgramData,
  EventDay,
  DressCode,
  HotelRec,
  TransportInfo,
} from "@davety/schema";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";
import { parseInlineDecorations } from "../../decorations/inline";

const DRESS_PRESET_LABEL: Record<NonNullable<DressCode["preset"]>, string> = {
  "smart-casual": "Smart Casual",
  formal: "Formal",
  "black-tie": "Black Tie",
  "white-tie": "White Tie",
  beach: "Plaj / Açık Hava",
  boho: "Boho",
  "henna-traditional": "Geleneksel (Kına)",
  "white-banned": "Beyaz / Krem giyilmemesi rica olunur",
};

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return iso;
  return d.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function DressCodeBadge({ code }: { code?: DressCode }) {
  if (!code || (!code.preset && !code.note)) return null;
  return (
    <div className="inline-flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] opacity-80">
      <span className="rounded-full border border-current/30 px-3 py-1">
        Kıyafet:{" "}
        {code.preset ? DRESS_PRESET_LABEL[code.preset] : null}
        {code.preset && code.note ? " · " : null}
        {code.note ?? null}
      </span>
    </div>
  );
}

function HotelList({ hotels }: { hotels?: HotelRec[] }) {
  if (!hotels || hotels.length === 0) return null;
  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="text-[11px] uppercase tracking-[0.2em] opacity-80">
        Otel Önerileri
      </div>
      <ul className="grid grid-cols-1 gap-1.5">
        {hotels.map((h, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-3 text-xs border-b border-current/10 pb-1.5"
          >
            <span className="flex flex-col">
              <span className="font-medium">{h.name}</span>
              <span className="opacity-70">
                {h.distanceKm != null ? `${h.distanceKm} km` : null}
                {h.distanceKm != null && h.priceTryPerNight ? " · " : null}
                {h.priceTryPerNight
                  ? `${h.priceTryPerNight}₺/gece itibariyle`
                  : null}
              </span>
            </span>
            {h.bookingUrl ? (
              <a
                href={h.bookingUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="text-[11px] underline whitespace-nowrap"
              >
                Rezervasyon
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TransportPanel({ transport }: { transport?: TransportInfo }) {
  if (!transport) return null;
  const hasAny =
    transport.shuttleEnabled ||
    transport.shuttleNote ||
    (transport.shuttleTimes && transport.shuttleTimes.length > 0) ||
    transport.parkingNote ||
    transport.publicTransitNote;
  if (!hasAny) return null;
  return (
    <div className="mt-3 flex flex-col gap-1 text-xs">
      <div className="text-[11px] uppercase tracking-[0.2em] opacity-80">
        Ulaşım
      </div>
      {transport.shuttleEnabled ? (
        <p>
          <strong>Servis:</strong>{" "}
          {transport.shuttleNote ?? "Mekana özel servis sağlanacak."}
        </p>
      ) : null}
      {transport.shuttleTimes && transport.shuttleTimes.length > 0 ? (
        <p>
          <strong>Servis saatleri:</strong>{" "}
          {transport.shuttleTimes.join(", ")}
        </p>
      ) : null}
      {transport.parkingNote ? (
        <p>
          <strong>Otopark:</strong> {transport.parkingNote}
        </p>
      ) : null}
      {transport.publicTransitNote ? (
        <p>
          <strong>Toplu taşıma:</strong> {transport.publicTransitNote}
        </p>
      ) : null}
    </div>
  );
}

function DayCard({ day }: { day: EventDay }) {
  if (day.visible === false) return null;
  return (
    <article className="rounded-lg border border-current/15 px-4 py-4 flex flex-col gap-2">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h4 className="font-display text-xl">{day.label}</h4>
        <span className="text-xs opacity-70">
          {formatDate(day.date)}
          {day.time ? ` · ${day.time}` : ""}
        </span>
      </header>
      {day.venueName || day.venueAddress ? (
        <div className="text-sm">
          {day.venueName ? <strong>{day.venueName}</strong> : null}
          {day.venueName && day.venueAddress ? " · " : null}
          {day.venueAddress ? <span>{day.venueAddress}</span> : null}
          {day.mapUrl ? (
            <>
              {" · "}
              <a
                href={day.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Yol Tarifi
              </a>
            </>
          ) : null}
        </div>
      ) : null}
      {day.items && day.items.length > 0 ? (
        <ul className="space-y-2 mt-1">
          {day.items.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 border-b border-current/10 pb-1.5"
            >
              <span className="text-sm tabular-nums opacity-80 w-14">
                {item.time}
              </span>
              <span className="flex-1 text-sm">
                {parseInlineDecorations(item.label)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <DressCodeBadge code={day.dressCode} />
      <HotelList hotels={day.hotels} />
      <TransportPanel transport={day.transport} />
    </article>
  );
}

export function EventProgramView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<EventProgramData>) {
  const rootStyle = styleToCss(block.style);
  const { items, eventDays, dressCode } = block.data;

  const click = (id: string) =>
    editable && onFieldSelect
      ? {
          "data-field-id": id,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onFieldSelect(id);
          },
          className: "cursor-pointer hover:bg-yellow-100/30 rounded px-1",
        }
      : {};

  const useChain = Array.isArray(eventDays) && eventDays.length > 0;

  return (
    <section className="px-2 py-4" style={rootStyle}>
      <h3
        {...click("heading")}
        className="font-display text-2xl text-center mb-6"
        style={fieldStyle(block, "heading")}
      >
        {useChain ? "Etkinlik Zinciri" : "Etkinlik Programı"}
      </h3>

      {useChain ? (
        <div className="max-w-md mx-auto flex flex-col gap-4">
          {eventDays!.map((day) => (
            <DayCard key={day.id} day={day} />
          ))}
        </div>
      ) : (
        <ul className="max-w-md mx-auto space-y-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-4 border-b border-current/10 pb-2"
            >
              <div className="font-chakra text-sm tabular-nums opacity-80 w-14">
                {item.time}
              </div>
              <div className="flex-1 text-sm">
                {parseInlineDecorations(item.label)}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!useChain && dressCode ? (
        <div className="max-w-md mx-auto mt-4 flex justify-center">
          <DressCodeBadge code={dressCode} />
        </div>
      ) : null}
    </section>
  );
}
