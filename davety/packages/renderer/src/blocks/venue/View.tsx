"use client";

import type { VenueData } from "@davety/schema";
import { useRendererContext } from "../../context";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function toCalendarStamp(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function buildIcs(args: {
  title: string;
  address: string;
  startIso: string;
  durationMinutes?: number;
  url?: string;
}): string {
  const start = new Date(args.startIso);
  const end = new Date(
    start.getTime() + (args.durationMinutes ?? 240) * 60_000
  );
  const escape = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DavetYolla//Invitation//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${start.getTime().toString(36)}@davetyolla.com`,
    `DTSTAMP:${toCalendarStamp(new Date())}`,
    `DTSTART:${toCalendarStamp(start)}`,
    `DTEND:${toCalendarStamp(end)}`,
    `SUMMARY:${escape(args.title)}`,
    `LOCATION:${escape(args.address)}`,
  ];
  if (args.url) lines.push(`URL:${escape(args.url)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

function googleCalendarHref(args: {
  title: string;
  address: string;
  startIso: string;
  durationMinutes?: number;
  url?: string;
}): string {
  const start = new Date(args.startIso);
  const end = new Date(
    start.getTime() + (args.durationMinutes ?? 240) * 60_000
  );
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: args.title,
    dates: `${toCalendarStamp(start)}/${toCalendarStamp(end)}`,
    location: args.address,
    details: args.url ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function VenueView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<VenueData>) {
  const rootStyle = styleToCss(block.style);
  const ctx = useRendererContext();
  const { venueName, venueAddress, mapUrl, directionsUrl, reminderEnabled } =
    block.data;

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

  // Render anında new Date() SSR/CSR farklı değer üretip hydration
  // mismatch'a sebep oluyordu (calendar href'inde). Boş fallback —
  // ctx.startIso provider'dan gelmeli; gelmiyorsa calendar link
  // kullanışsız olur ama statik kalır.
  const startIso = ctx?.startIso ?? "";
  const shareUrl = ctx?.publicUrl;

  const handleIcsDownload = () => {
    const ics = buildIcs({
      title: venueName || "Düğün",
      address: venueAddress || "",
      startIso,
      url: shareUrl,
    });
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "davet.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const mapsHref =
    directionsUrl ||
    (venueAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          venueAddress
        )}`
      : null);

  return (
    <section className="px-2 py-4 text-center" style={rootStyle}>
      <p
        {...click("venueLabel")}
        className="font-sans text-xs uppercase tracking-[0.25em] opacity-70 mb-2"
        style={fieldStyle(block, "venueLabel")}
      >
        Etkinlik Alanı
      </p>
      <h3
        {...click("venueName")}
        className="font-display text-2xl"
        style={fieldStyle(block, "venueName")}
      >
        {venueName || "Mekan Adı"}
      </h3>
      {venueAddress ? (
        <p
          {...click("venueAddress")}
          className="text-sm opacity-80 mt-2 max-w-md mx-auto"
          style={fieldStyle(block, "venueAddress")}
        >
          {venueAddress}
        </p>
      ) : null}

      {mapUrl ? (
        <div className="mt-5 max-w-md mx-auto aspect-video rounded-md overflow-hidden border border-current/10">
          <iframe
            src={mapUrl}
            title={venueName || "Mekan haritası"}
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
        {reminderEnabled ? (
          <>
            <a
              href={googleCalendarHref({
                title: venueName || "Düğün",
                address: venueAddress || "",
                startIso,
                url: shareUrl,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-4 py-2 rounded-md border border-current/30 hover:bg-current/5"
            >
              Google Takvime Ekle
            </a>
            <button
              onClick={handleIcsDownload}
              className="text-xs px-4 py-2 rounded-md border border-current/30 hover:bg-current/5"
            >
              Apple / Outlook (.ics)
            </button>
          </>
        ) : null}
        {mapsHref ? (
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-4 py-2 rounded-md border border-current/30 hover:bg-current/5"
          >
            Yol Tarifi Al
          </a>
        ) : null}
      </div>
    </section>
  );
}
