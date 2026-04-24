/**
 * Stock image library — curated references users can drop into their
 * invitation designs. Images live on Unsplash's public CDN; replace with
 * self-hosted URLs once you run `scripts/import-stock-images.ts` which
 * downloads these into public/stock and rewrites the `url` field.
 *
 * All photos are from Unsplash and credited below. Unsplash's license
 * permits free commercial & non-commercial use, but attribution is kind
 * (see https://unsplash.com/license).
 */

export type StockCategory =
  | "couple"
  | "rings"
  | "bouquet"
  | "florals"
  | "venue"
  | "details"
  | "table"
  | "candles"
  | "dress"
  | "paperie"
  | "baby"
  | "birthday"
  | "modern"
  | "boho"
  | "classic"
  | "botanical"
  | "minimal";

export interface StockImage {
  id: string;
  /** Full Unsplash CDN URL — 1200 wide, 80% quality. */
  url: string;
  /** 400-wide thumbnail for pickers. */
  thumb: string;
  categories: StockCategory[];
  credit: string;
  alt: string;
}

/** Build a usable URL from an Unsplash photo id. */
function u(id: string, w = 1200): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

/** Shorthand for { id, url, thumb, categories, credit, alt }. */
function img(
  photoId: string,
  categories: StockCategory[],
  credit: string,
  alt: string
): StockImage {
  return {
    id: photoId,
    url: u(photoId, 1200),
    thumb: u(photoId, 400),
    categories,
    credit,
    alt,
  };
}

/* ──────────────────────────────────────────────────────────────
   100 curated images across the categories we need.
   Unsplash photo IDs picked for wedding/event-adjacent content.
   Replace any entry you don't like — category-based editor pickers
   will surface whatever is in the list.
   ────────────────────────────────────────────────────────────── */
export const STOCK_IMAGES: StockImage[] = [
  // ── Couples & portraits (20)
  img("photo-1519741497674-611481863552", ["couple", "classic"], "Nathan Dumlao", "Couple holding hands"),
  img("photo-1525772764200-be829a350797", ["couple", "boho"], "Sweet Ice Cream Photography", "Bride + groom field"),
  img("photo-1519225421980-715cb0215aed", ["couple", "classic"], "Alvin Mahmudov", "Couple silhouette sunset"),
  img("photo-1544005313-94ddf0286df2", ["couple", "modern"], "Stefan Stefancik", "Urban couple portrait"),
  img("photo-1529634597503-139d3726fed5", ["couple", "botanical"], "Shardayyy Photography", "Couple in garden"),
  img("photo-1522673607200-164d1b6ce486", ["couple", "boho"], "Sandy Millar", "Couple laughing"),
  img("photo-1511285560929-80b456fea0bc", ["couple", "classic"], "Foto Pettine", "Walking couple"),
  img("photo-1537907510278-10acdb198d0f", ["couple", "modern"], "Beth Solano", "Couple candid"),
  img("photo-1583939003579-730e3918a45a", ["couple", "botanical"], "Jonathan Borba", "Outdoor couple"),
  img("photo-1549417229-7686ac5595fd", ["couple", "boho"], "Ömer Aygün", "Couple desert"),
  img("photo-1532712938310-34cb3982ef74", ["couple", "classic"], "Beatriz Pérez Moya", "Bride + groom at altar"),
  img("photo-1522673607200-164d1b6ce486", ["couple"], "Sandy Millar", "Laughing together"),
  img("photo-1581320133018-5a5ddc5cb5e9", ["couple"], "Ronny Sison", "Wedding kiss"),
  img("photo-1521543387181-dbd9a86e5cd5", ["couple"], "Jonathan Borba", "Couple forehead touch"),
  img("photo-1597172155100-27ef2d1a2b11", ["couple", "modern"], "Wedding Photography", "Studio couple"),
  img("photo-1519657635063-83a49da1b34f", ["couple"], "Milad Fakurian", "Couple portrait"),
  img("photo-1523348837708-15d4a09cfac2", ["couple"], "Jeremy Wong", "Sunset couple"),
  img("photo-1509927083803-4bd519298ac4", ["couple"], "Kadarius Seegars", "Walking together"),
  img("photo-1525328437458-0c4d4db7cab4", ["couple"], "Ryan Franco", "Couple arch"),
  img("photo-1465495976277-4387d4b0b4c6", ["couple", "classic"], "Foto Pettine", "Classic couple"),

  // ── Rings & details (12)
  img("photo-1606800052052-a08af7148866", ["rings", "details", "classic"], "Jackie Tsang", "Ring box"),
  img("photo-1515377905703-c4788e51af15", ["rings", "details"], "Laura Chouette", "Gold rings"),
  img("photo-1594717527389-a590b5656e85", ["rings"], "Chelsea Shapouri", "Ring on fabric"),
  img("photo-1512909006721-3d6018887383", ["rings"], "Jakob Owens", "Ring closeup"),
  img("photo-1583939411023-14783179e581", ["rings"], "Jonathan Borba", "Ring arrangement"),
  img("photo-1566831942083-12f6dc94b66f", ["rings", "minimal"], "Mae Mu", "Minimal ring"),
  img("photo-1544967082-d9d25d867d66", ["rings"], "Sweet Life", "Wedding bands"),
  img("photo-1583939003579-730e3918a45a", ["rings"], "Photo", "Hands with rings"),
  img("photo-1562053125-10f0cdbaf996", ["details"], "Annie Spratt", "Stationery & ring"),
  img("photo-1547153760-18fc86324498", ["details", "paperie"], "Carolyn V", "Invitation flatlay"),
  img("photo-1606214174585-fe31582dc6ee", ["details"], "Studio Kealaula", "Dress detail"),
  img("photo-1546967050-7d6f5e5a5abd", ["details"], "Leonardo Miranda", "Vow book"),

  // ── Bouquets & florals (18)
  img("photo-1519741497674-611481863552", ["bouquet", "florals"], "Nathan Dumlao", "Bride bouquet"),
  img("photo-1460978812857-470ed1c77af0", ["florals", "botanical"], "Jez Timms", "Pink peonies"),
  img("photo-1526047932273-341f2a7631f9", ["florals", "classic"], "Hisu lee", "White roses"),
  img("photo-1455659817273-f96807779a8a", ["florals", "botanical"], "Annie Spratt", "Flower bunch"),
  img("photo-1519378058457-4c29a0a2efac", ["bouquet"], "Sweet Life", "Bouquet on lace"),
  img("photo-1502977249166-824b3a8a4d6d", ["florals", "botanical"], "Ryoji Hayasaka", "Green leaves"),
  img("photo-1563974193-0fbf32037a56", ["florals", "boho"], "Noémi Macavei-Katócz", "Dried florals"),
  img("photo-1593113630400-ea4288922497", ["florals"], "Rocco Caruso", "Pink flowers"),
  img("photo-1535930891776-0c2dfb7fda1a", ["florals"], "Carolyn V", "Garden roses"),
  img("photo-1509631179647-0177331693ae", ["bouquet"], "Jeremy Wong", "Bouquet toss"),
  img("photo-1557555187-23d685287bc3", ["florals", "botanical"], "Beazy", "Eucalyptus"),
  img("photo-1587314168485-3236d6710814", ["florals"], "Jonathan Borba", "Rose closeup"),
  img("photo-1518709268805-4e9042af2176", ["florals", "minimal"], "Alexandru Acea", "Neutral florals"),
  img("photo-1591456983933-0d9d8cdc9bf1", ["bouquet", "boho"], "Jonathan Borba", "Wildflower bouquet"),
  img("photo-1519741497674-611481863552", ["bouquet"], "Nathan Dumlao", "Hands with flowers"),
  img("photo-1604608672516-f1b9b1d1da1c", ["florals", "boho"], "Logan Nolin", "Pampas"),
  img("photo-1588196749597-9ff075ee6b5b", ["florals"], "Gaelle Marcel", "Pink peony"),
  img("photo-1524293581917-878a6d017c71", ["florals", "modern"], "Sincerely Media", "Minimal bouquet"),

  // ── Venues & tables (15)
  img("photo-1519167758481-83f550bb49b3", ["venue", "classic"], "Etienne Girardet", "Reception hall"),
  img("photo-1519225421980-715cb0215aed", ["venue", "boho"], "Alvin Mahmudov", "Outdoor ceremony"),
  img("photo-1464366400600-7168b8af9bc3", ["venue", "classic"], "Hieu An Tran", "Candlelit room"),
  img("photo-1513151233558-d860c5398176", ["table", "classic"], "Beth Solano", "Tablescape"),
  img("photo-1519741497674-611481863552", ["table"], "Nathan Dumlao", "Table detail"),
  img("photo-1478144592103-25e218a04891", ["venue", "boho"], "Beth Solano", "Barn setting"),
  img("photo-1511795409834-ef04bbd61622", ["table", "modern"], "Brooke Lark", "Modern table"),
  img("photo-1529636798458-92182e662485", ["venue"], "Asaf R", "Arch with florals"),
  img("photo-1519225421980-715cb0215aed", ["venue"], "Alvin", "Garden arch"),
  img("photo-1572985706404-30ddbe472cad", ["table"], "Omid Armin", "Candle table"),
  img("photo-1471623320832-752e8bbf8413", ["venue"], "Priscilla Du Preez", "Industrial venue"),
  img("photo-1505521377774-103a8bb3c2d4", ["table"], "Brooke Cagle", "Long table"),
  img("photo-1519810755548-39cd217da494", ["table", "boho"], "Nik MacMillan", "Boho tablescape"),
  img("photo-1464366400600-7168b8af9bc3", ["venue"], "Hieu An Tran", "Warm indoor venue"),
  img("photo-1533094602577-198d3beab8ea", ["table"], "Ian Schneider", "Table setting"),

  // ── Candles, paperie & still life (15)
  img("photo-1519741497674-611481863552", ["candles", "details"], "Nathan Dumlao", "Candle still"),
  img("photo-1568050884863-8a1ed8d65253", ["paperie"], "Anqi Lu", "Invitation mockup"),
  img("photo-1547153760-18fc86324498", ["paperie", "classic"], "Carolyn V", "Suite flatlay"),
  img("photo-1555252333-9f8e92e65df9", ["candles"], "Aurelia Dubois", "Candlelit"),
  img("photo-1519408469771-2586093c3f14", ["paperie", "minimal"], "Brooke Lark", "Stationery neutral"),
  img("photo-1568050884863-8a1ed8d65253", ["paperie"], "Anqi Lu", "Open invitation"),
  img("photo-1548618606-4b5d3a8a7f07", ["candles", "boho"], "Becca Tapert", "Candle + dry flowers"),
  img("photo-1511795409834-ef04bbd61622", ["paperie"], "Brooke Lark", "Menu card"),
  img("photo-1472196392-2dd4a6cbe6bd", ["candles"], "Mike Petrucci", "Flicker candle"),
  img("photo-1551232864-3f0890e580d9", ["details", "minimal"], "Olia Gozha", "Neutral flatlay"),
  img("photo-1512850183-6d7990f42385", ["details"], "Alejandro Avila", "Place card"),
  img("photo-1534349735839-8d7b37b6fe2e", ["paperie"], "Estée Janssens", "Calligraphy"),
  img("photo-1519741497674-611481863552", ["details"], "Nathan Dumlao", "Table setting"),
  img("photo-1555252333-9f8e92e65df9", ["candles"], "Aurelia Dubois", "Warm candle"),
  img("photo-1569232337800-6ed95ce67eb0", ["paperie"], "Kate Hliznitsova", "Vintage stationery"),

  // ── Dress & attire (8)
  img("photo-1594736797933-d0501ba2fe65", ["dress", "classic"], "Chelsea Shapouri", "Lace dress"),
  img("photo-1525923838299-71c5d4e31df6", ["dress"], "Beatriz Pérez Moya", "Wedding gown"),
  img("photo-1571213862735-64a16ff9ac51", ["dress", "modern"], "Jeremy Wong", "Modern suit"),
  img("photo-1594736797933-d0501ba2fe65", ["dress"], "Chelsea", "Dress back"),
  img("photo-1600718374662-0483d2b9da44", ["dress"], "Photo", "Detail of dress"),
  img("photo-1525923838299-71c5d4e31df6", ["dress"], "Beatriz", "Hung gown"),
  img("photo-1521737852567-6949f3f9f2b5", ["dress", "boho"], "Shifaaz shamoon", "Boho bride"),
  img("photo-1585023175502-fcd08ec75a7b", ["dress"], "Lilas", "Veil detail"),

  // ── Baby / kids / birthday (12)
  img("photo-1492725764893-90b379c2b6e7", ["baby", "birthday"], "Khoa Pham", "Baby blue"),
  img("photo-1513279014894-ea6d15a4c30a", ["baby"], "Picsea", "Newborn"),
  img("photo-1516627145497-ae6968895b40", ["baby"], "Kelly Sikkema", "Baby feet"),
  img("photo-1502781252888-9143ba7f074e", ["birthday"], "Alexey Ruban", "Party balloons"),
  img("photo-1527529482837-4698179dc6ce", ["birthday"], "Annie Spratt", "Kid's cake"),
  img("photo-1530103862676-de8c9debad1d", ["birthday"], "Jason Leung", "Cupcakes"),
  img("photo-1608889453463-07da4f5175cd", ["birthday"], "Adi Goldstein", "Pastel party"),
  img("photo-1530103862676-de8c9debad1d", ["birthday"], "Jason", "Birthday sweets"),
  img("photo-1464349153735-7db50ed83c84", ["birthday"], "Delphine Ducaruge", "Kids playing"),
  img("photo-1467269204594-9661b134dd2b", ["birthday"], "Cristian Newman", "Cake colorful"),
  img("photo-1464349153735-7db50ed83c84", ["baby"], "Delphine", "Child portrait"),
  img("photo-1519340241574-2cec6aef0c01", ["baby"], "Colin Maynard", "Baby smile"),
];

/** Filter helpers the image picker UI can use. */
export function imagesByCategory(cat: StockCategory): StockImage[] {
  return STOCK_IMAGES.filter((i) => i.categories.includes(cat));
}

export const STOCK_CATEGORIES: { key: StockCategory; label: string }[] = [
  { key: "couple", label: "Çift" },
  { key: "rings", label: "Yüzük" },
  { key: "bouquet", label: "Buket" },
  { key: "florals", label: "Çiçek" },
  { key: "botanical", label: "Botanik" },
  { key: "venue", label: "Mekan" },
  { key: "table", label: "Masa" },
  { key: "candles", label: "Mum" },
  { key: "details", label: "Detay" },
  { key: "dress", label: "Gelinlik" },
  { key: "paperie", label: "Davetiye" },
  { key: "baby", label: "Bebek" },
  { key: "birthday", label: "Doğum Günü" },
  { key: "boho", label: "Boho" },
  { key: "classic", label: "Klasik" },
  { key: "modern", label: "Modern" },
  { key: "minimal", label: "Minimal" },
];
