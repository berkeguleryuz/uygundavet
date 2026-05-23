export const SYSTEM_PROMPT = `Sen Uygun Davet adlı Türkiye merkezli dijital düğün davetiyesi platformunun içerik editörüsün. Görevin SEO uyumlu, akıcı, doğal Türkçe blog yazıları üretmek.

KATI KURALLAR:
- Em-dash (—) KESİNLİKLE kullanma. Yerine virgül, parantez veya nokta kullan.
- "RSVP" yerine "LCV" (Lütfen Cevap Veriniz) kullan. Türkçe içerikte LCV standarttır.
- Yapay zeka klişelerinden kaçın: "günümüz dijital çağında", "kuşkusuz", "ayrıca", "bunun yanı sıra", "sonuç olarak" gibi kalıpları kullanma.
- Doğrudan, somut, örnekli yaz. Belirsiz iddialardan kaçın.
- H1 yazma (başlık ayrı alanda). H2 ve H3 kullan.
- Türkçe büyük harf kullanımına dikkat (özel adlar dışında küçük).

MARKA BİLGİSİ:
- Ürün: Modern, şık, tamamen kişiselleştirilebilir dijital düğün davetiyeleri
- Özellikler: LCV formu, anı defteri, QR kod paylaşımı, misafir yönetimi, galeri, etkinlik takvimi, 8 farklı tema (crystal, garden, golden, grow, ocean, pearl, rose, sunset)
- Hedef kitle: Düğün planlayan çiftler, modern tercihler, dijital alışkın
- Ton: Sıcak, profesyonel, yardımsever, çift dostu

ÇIKTI FORMATI:
- Sadece Markdown ham metin döndür. Açıklama, "İşte yazınız:" gibi giriş cümleleri ekleme.`;

export type AiAction = "full-post" | "title-suggest" | "intro" | "h2-outline" | "meta-description" | "excerpt";

export interface AiContext {
  topic?: string;
  title?: string;
  keywords?: string[];
  targetLength?: "short" | "standard" | "long";
  existingContent?: string;
}

const LENGTH_MAP = {
  short: "800 kelime civarı",
  standard: "1500 kelime civarı",
  long: "2500 kelime civarı",
};

export function buildUserPrompt(action: AiAction, ctx: AiContext): string {
  switch (action) {
    case "full-post":
      return `Konu: "${ctx.topic ?? ""}"
${ctx.keywords?.length ? `Hedef anahtar kelimeler: ${ctx.keywords.join(", ")}` : ""}
Hedef uzunluk: ${LENGTH_MAP[ctx.targetLength ?? "standard"]}.

Bu konuda tam bir blog yazısı yaz. H2 ve H3 ile bölümle. Giriş paragrafı, 4-7 ana bölüm, ve kapanış içersin. Sadece Markdown gövde döndür.`;

    case "title-suggest":
      return `Konu: "${ctx.topic ?? ""}"
Bu konu için 5 farklı, SEO uyumlu, tıklanma cazibesi yüksek başlık öner.
Her satır bir başlık, numara veya işaret kullanma. Düz metin döndür.`;

    case "intro":
      return `Başlık: "${ctx.title ?? ""}"
Bu başlığa uygun 2-3 paragraflık etkileyici bir giriş yaz. Okuyucuyu içeri çek, ana fikri net ver. Sadece paragraf metni döndür, başlık ekleme.`;

    case "h2-outline":
      return `Başlık: "${ctx.title ?? ""}"
Bu yazı için 4-7 adet H2 başlık öner. Her başlık net, konuya uygun, okuyucu sorusuna cevap veren olsun. Her satır bir H2, "## " prefixiyle döndür.`;

    case "meta-description":
      return `Başlık: "${ctx.title ?? ""}"
${ctx.existingContent ? `İlk paragraf: ${ctx.existingContent.slice(0, 500)}` : ""}
Bu yazı için 150-160 karakter arası SEO meta açıklaması yaz. Doğal cümle, anahtar kelime içersin, tıklama daveti olsun. Sadece metin döndür.`;

    case "excerpt":
      return `Aşağıdaki Markdown içerikten 140-160 karakter arası excerpt (özet) çıkar:

${ctx.existingContent?.slice(0, 2000) ?? ""}

Sadece özet metnini döndür.`;
  }
}
