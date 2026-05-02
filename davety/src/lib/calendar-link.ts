/**
 * Build third-party calendar deep-links for the public invitation
 * "etkinliği takvime ekle" button. We support Google, Outlook, and
 * a generic .ics download for everything else (Apple Calendar follows
 * the .ics path).
 *
 * Times are kept in the host's stated timezone string from doc.meta;
 * we do not attempt timezone conversion. Recipients see the wall-clock
 * time the host published, which is what they expect.
 */

export interface CalendarEventInput {
  title: string;
  description?: string;
  location?: string;
  /** ISO 8601 datetime without offset (the host's local wall time). */
  startLocalIso: string;
  /** Default duration is 4 hours. */
  durationHours?: number;
  /** Optional URL to include in the description. */
  url?: string;
}

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

function parseStart(input: CalendarEventInput): { start: Date; end: Date } {
  const start = new Date(input.startLocalIso);
  if (!Number.isFinite(start.getTime())) {
    throw new Error("calendar-link: invalid startLocalIso");
  }
  const durationHours = input.durationHours ?? 4;
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  return { start, end };
}

export function googleCalendarUrl(input: CalendarEventInput): string {
  const { start, end } = parseStart(input);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates: `${toCalendarStamp(start)}/${toCalendarStamp(end)}`,
    details: [input.description ?? "", input.url ?? ""].filter(Boolean).join("\n\n"),
    location: input.location ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(input: CalendarEventInput): string {
  const { start, end } = parseStart(input);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: input.title,
    body: [input.description ?? "", input.url ?? ""].filter(Boolean).join("\n\n"),
    location: input.location ?? "",
    startdt: start.toISOString(),
    enddt: end.toISOString(),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Build an RFC 5545 .ics body. The caller is responsible for serving
 * it with `Content-Type: text/calendar` and `Content-Disposition`.
 */
export function buildIcs(input: CalendarEventInput): string {
  const { start, end } = parseStart(input);
  const now = toCalendarStamp(new Date());
  const uid = `${start.getTime().toString(36)}@davetyolla.com`;
  const escape = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DavetYolla//Invitation//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${toCalendarStamp(start)}`,
    `DTEND:${toCalendarStamp(end)}`,
    `SUMMARY:${escape(input.title)}`,
  ];
  if (input.description) lines.push(`DESCRIPTION:${escape(input.description)}`);
  if (input.location) lines.push(`LOCATION:${escape(input.location)}`);
  if (input.url) lines.push(`URL:${escape(input.url)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}
