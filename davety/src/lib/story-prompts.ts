/**
 * "Biz nasıl tanıştık" hikaye yazıcı için statik prompt kütüphanesi.
 *
 * Tema bazlı önerilen başlıklar ve örnek metinler. Editor'deki
 * StoryTimeline panelinden açılan asistana feed olur. AI üretimi yok,
 * sadece başlangıç şablonları.
 */

export interface StoryTone {
  id: string;
  label: string;
  description: string;
}

export const STORY_TONES: StoryTone[] = [
  {
    id: "warm",
    label: "Sıcak / Samimi",
    description:
      "Aile ve yakın arkadaş tonunda, küçük detaylara odaklanan yumuşak bir anlatım.",
  },
  {
    id: "playful",
    label: "Eğlenceli",
    description:
      "Esprili, tatlı bir dil. Beklenmedik anılar ve içeriden esprilerle.",
  },
  {
    id: "elegant",
    label: "Zarif",
    description:
      "Edebi, ölçülü cümleler. Klasik düğün davetiyesi tonu.",
  },
  {
    id: "modern",
    label: "Modern / Kısa",
    description: "Net, kısa cümleler. Az yazıyla çok şey anlatma.",
  },
];

export interface StoryMilestoneSuggestion {
  id: string;
  title: string;
  helper: string;
  /** ISO date placeholder (YYYY-MM-DD), used to populate the date field. */
  datePlaceholder?: string;
}

export const STORY_MILESTONE_SUGGESTIONS: StoryMilestoneSuggestion[] = [
  {
    id: "first-meet",
    title: "İlk karşılaşma",
    helper:
      "Nerede tanıştınız, kim nasıl başlattı? İlk izlenim nelerdi? Üç cümleyi geçmemeye çalış.",
  },
  {
    id: "first-date",
    title: "İlk randevu",
    helper:
      "Mekan, his, dönüş yolundaki konuşma. Kimsenin bilmediği bir detay varsa o işe yarar.",
  },
  {
    id: "i-knew-it",
    title: "Bunun o olduğunu anladığım an",
    helper:
      "Genelde sıradan bir an. Trafikte sıkışmak, bir hastane ziyareti, sahildeki sessizlik.",
  },
  {
    id: "first-trip",
    title: "İlk seyahat",
    helper:
      "Şehir, plan, plan dışı sürprizler. Birlikte çekilen bir fotoğrafla iyi gider.",
  },
  {
    id: "meet-family",
    title: "Aileyle ilk tanışma",
    helper:
      "Hangi aile, nerede, kim ne dedi? Anne / babaya yakışan bir replikle bitirebilirsin.",
  },
  {
    id: "proposal",
    title: "Evlilik teklifi",
    helper:
      "Mekan, sürpriz unsuru, gözyaşı, kahkaha, kim nereden ortaya çıktı?",
  },
  {
    id: "engagement",
    title: "Nişan",
    helper: "Tarih ve mekan. İçten bir tek cümle yeter.",
  },
];

/**
 * Tone'a göre giriş cümlesi önerisi. Editör boş bir story bloğu
 * açtığında çiftin tonunu seçtiğinde bu cümle textarea'ya prefill
 * olarak girer.
 */
export function leadSentenceFor(tone: StoryTone["id"], names: {
  bride?: string;
  groom?: string;
}): string {
  const couple = [names.bride, names.groom].filter(Boolean).join(" & ");
  switch (tone) {
    case "playful":
      return `${couple} hikayesi pek de planlı başlamadı; kahkaha eksik olmadı.`;
    case "elegant":
      return `${couple} yolu, küçük tesadüflerin büyük bir hikayeye dönüştüğü bir yoldur.`;
    case "modern":
      return `${couple}: iki insan, bir karar.`;
    case "warm":
    default:
      return `${couple} hikayesi, bir tanışmayla başladı ve burada, bu davetiyede sürmeye devam ediyor.`;
  }
}
