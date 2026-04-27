"use client";

import type { VenueData } from "@davety/schema";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";

function buildIcs(args: {
  title: string;
  address: string;
  startIso: string;
  durationMinutes?: number;
}): string {
  const start = new Date(args.startIso);
  const end = new Date(start.getTime() + (args.durationMinutes ?? 240) * 60_000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@davety`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${args.title}`,
    `LOCATION:${args.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function VenueView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<VenueData>) {
  const rootStyle = styleToCss(block.style);
  const { venueName, venueAddress, mapUrl, directionsUrl, reminderEnabled } =
    block.data;

  const click = (id: string) =>
    editable && onFieldSelect
      ? {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onFieldSelect(id);
          },
          className: "cursor-pointer hover:bg-yellow-100/30 rounded px-1",
        }
      : {};

  const handleReminder = () => {
    const ics = buildIcs({
      title: venueName || "Düğün",
      address: venueAddress || "",
      startIso: new Date().toISOString(),
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
    <section className="px-2 py-10 text-center" style={rootStyle}>
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
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
        {reminderEnabled ? (
          <button
            onClick={handleReminder}
            className="text-xs px-4 py-2 rounded-md border border-current/30 hover:bg-current/5"
          >
            Hatırlatıcı Aç
          </button>
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
