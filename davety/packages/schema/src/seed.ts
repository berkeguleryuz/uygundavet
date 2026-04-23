import { nanoid } from "nanoid";
import type { Block } from "./blocks";
import type { InvitationDoc, Locale } from "./doc";
import { defaultTheme } from "./theme";

interface SeedArgs {
  weddingDate: string;
  weddingTime: string;
  locale?: Locale;
  brideName?: string;
  groomName?: string;
  /** Optional pre-set template identifier (for admin-seeded designs). */
  templateSlug?: string;
}

/**
 * Full rich default template — mirrors the reference invitations
 * (decorative hero + countdown + date row + families + venue with
 * action buttons + event program + gallery + memory book + RSVP).
 */
export function buildDefaultDoc(args: SeedArgs): InvitationDoc {
  const now = new Date().toISOString();
  const locale: Locale = args.locale ?? "tr";
  const brideName = args.brideName ?? (locale === "tr" ? "Gelin" : "Bride");
  const groomName = args.groomName ?? (locale === "tr" ? "Damat" : "Groom");
  const targetIso = `${args.weddingDate}T${args.weddingTime}:00`;

  const tr = locale === "tr";
  const de = locale === "de";

  const blocks: Block[] = [
    // 1. HERO with decorative divider + subtitle + description
    {
      id: nanoid(8),
      type: "hero",
      visible: true,
      style: { fontFamily: "Merienda", align: "center" },
      data: {
        brideName,
        groomName,
        subtitle: tr
          ? "Aşkın Başladığı Gün"
          : de
          ? "Der Tag, an dem unsere Liebe begann"
          : "The Day Our Love Began",
        description: tr
          ? "Bir masal gibi başlayan hikâyemizin en özel gününde, sizi yanımızda görmekten mutluluk duyarız."
          : de
          ? "Am besonderen Tag unserer Märchenhochzeit möchten wir Sie an unserer Seite haben."
          : "On the most special day of our fairytale story, we would be honored to have you by our side.",
      },
    },

    // 2. COUNTDOWN
    {
      id: nanoid(8),
      type: "countdown",
      visible: true,
      style: { align: "center" },
      data: {
        targetIso,
        labels: tr
          ? { days: "Gün", hours: "Saat", minutes: "Dakika", seconds: "Saniye" }
          : de
          ? { days: "Tage", hours: "Std", minutes: "Min", seconds: "Sek" }
          : { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
      },
    },

    // 3. FAMILIES
    {
      id: nanoid(8),
      type: "families",
      visible: true,
      style: { align: "center" },
      data: {
        bride: {
          title: tr
            ? "Gelinin Ailesi"
            : de
            ? "Familie der Braut"
            : "Bride's Family",
          members: [],
        },
        groom: {
          title: tr
            ? "Damadın Ailesi"
            : de
            ? "Familie des Bräutigams"
            : "Groom's Family",
          members: [],
        },
      },
    },

    // 4. VENUE — locked (action buttons are functional, non-deletable section)
    {
      id: nanoid(8),
      type: "venue",
      visible: true,
      locked: true,
      style: { align: "center" },
      data: {
        venueName: tr
          ? "Davet Salonu"
          : de
          ? "Veranstaltungsort"
          : "Venue Name",
        venueAddress: "",
        reminderEnabled: true,
      },
    },

    // 5. EVENT PROGRAM
    {
      id: nanoid(8),
      type: "event_program",
      visible: true,
      style: { align: "center" },
      data: {
        items: tr
          ? [
              { time: "18:00", label: "Açılış Konuşması", icon: "mic" },
              { time: "19:00", label: "Müzik ve Dans", icon: "music" },
              { time: "20:00", label: "Yemek Servisi", icon: "food" },
              { time: "21:00", label: "Pastanın Kesilmesi", icon: "cake" },
            ]
          : [
              { time: "18:00", label: "Welcome" },
              { time: "19:00", label: "Ceremony" },
              { time: "20:00", label: "Dinner" },
              { time: "22:00", label: "Dance" },
            ],
      },
    },

    // 6. RSVP FORM — locked (guests press this button to submit)
    {
      id: nanoid(8),
      type: "rsvp_form",
      visible: true,
      locked: true,
      style: { align: "center" },
      data: {
        enabled: true,
        note: tr
          ? "Etkinlik sahibi katılım durumunuzu merak ediyor. Lütfen cevap veriniz."
          : de
          ? "Bitte geben Sie Ihre Teilnahme an."
          : "Please let us know if you will attend.",
      },
    },

    // 7. GALLERY — locked (guests upload their photos here)
    {
      id: nanoid(8),
      type: "gallery",
      visible: true,
      locked: true,
      style: { align: "center" },
      data: {
        items: [],
      },
    },

    // 8. MEMORY BOOK — locked (guests leave memories here)
    {
      id: nanoid(8),
      type: "memory_book",
      visible: true,
      locked: true,
      style: { align: "center" },
      data: {
        prompt: tr
          ? "Bizimle ilgili anılarınızı, dileklerinizi ve mesajlarınızı bu alanda paylaşabilirsiniz."
          : de
          ? "Teilt eure Erinnerungen, Wünsche und Nachrichten mit uns."
          : "Share your memories, wishes, and messages with us.",
        enabled: true,
      },
    },

    // 9. DONATION (optional, hidden by default)
    {
      id: nanoid(8),
      type: "donation",
      visible: false,
      style: { align: "center" },
      data: {
        title: tr
          ? "Bizlere Destek Olun"
          : de
          ? "Unterstützt uns"
          : "Support Us",
        description: tr
          ? "Bu özel günde bizimle olmak ve destek vermek isterseniz, bağış yapabilirsiniz."
          : de
          ? "Für Geschenke und Beiträge."
          : "Contributions welcome.",
        iban: "",
      },
    },

    // 10. FOOTER
    {
      id: nanoid(8),
      type: "footer",
      visible: true,
      style: { align: "center" },
      data: {
        text: "davety.app",
      },
    },
  ];

  return {
    meta: {
      createdAt: now,
      updatedAt: now,
      weddingDate: args.weddingDate,
      weddingTime: args.weddingTime,
      status: "draft",
      locale,
    },
    theme: defaultTheme,
    blocks,
  };
}
