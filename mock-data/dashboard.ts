// ─── Types ───────────────────────────────────────────────────────────────────

export type RsvpStatus = "confirmed" | "declined" | "pending";

export type GuestSource = "whatsapp" | "email" | "manual" | "qr-code" | "website";

export interface DashboardStat {
  title: string;
  value: string;
  trend?: { value: number; isPositive: boolean };
  subtitle?: string;
}

export interface Guest {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  rsvpStatus: RsvpStatus;
  guestCount: number;
  note: string;
  source: GuestSource;
}

export interface ChartDataPoint {
  date: string;
  confirmed: number;
  declined: number;
  pending: number;
}

export interface Activity {
  id: string;
  name: string;
  avatar: string;
  action: string;
  time: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const dashboardStats: DashboardStat[] = [
  {
    title: "Toplam Misafir",
    value: "248",
    trend: { value: 12, isPositive: true },
  },
  {
    title: "LCV Onay",
    value: "186/248",
    subtitle: "75%",
  },
  {
    title: "Düğüne Kalan Gün",
    value: "45",
  },
  {
    title: "Davetiye Görüntülenme",
    value: "1,847",
    trend: { value: 28, isPositive: true },
  },
];

export const chartDataMonth: ChartDataPoint[] = [
  { date: "Oca", confirmed: 12, declined: 3, pending: 40 },
  { date: "Şub", confirmed: 28, declined: 5, pending: 52 },
  { date: "Mar", confirmed: 45, declined: 8, pending: 60 },
  { date: "Nis", confirmed: 68, declined: 12, pending: 55 },
  { date: "May", confirmed: 95, declined: 15, pending: 48 },
  { date: "Haz", confirmed: 120, declined: 18, pending: 42 },
  { date: "Tem", confirmed: 148, declined: 20, pending: 35 },
  { date: "Ağu", confirmed: 170, declined: 22, pending: 28 },
  { date: "Eyl", confirmed: 186, declined: 24, pending: 38 },
];

export const chartDataWeek: ChartDataPoint[] = [
  { date: "Pzt", confirmed: 5, declined: 1, pending: 3 },
  { date: "Sal", confirmed: 8, declined: 0, pending: 4 },
  { date: "Çar", confirmed: 3, declined: 2, pending: 6 },
  { date: "Per", confirmed: 7, declined: 1, pending: 2 },
  { date: "Cum", confirmed: 12, declined: 0, pending: 5 },
  { date: "Cmt", confirmed: 9, declined: 3, pending: 1 },
  { date: "Paz", confirmed: 4, declined: 1, pending: 7 },
];

export const guests: Guest[] = [
  {
    id: "g-001",
    name: "Ali Yılmaz",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=AliYilmaz",
    phone: "+90 532 111 2233",
    email: "ali.yilmaz@email.com",
    rsvpStatus: "confirmed",
    guestCount: 2,
    note: "Eşiyle birlikte gelecek",
    source: "whatsapp",
  },
  {
    id: "g-002",
    name: "Fatma Demir",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=FatmaDemir",
    phone: "+90 533 222 3344",
    email: "fatma.demir@email.com",
    rsvpStatus: "confirmed",
    guestCount: 1,
    note: "",
    source: "email",
  },
  {
    id: "g-003",
    name: "Mehmet Kaya",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=MehmetKaya",
    phone: "+90 535 333 4455",
    email: "mehmet.kaya@email.com",
    rsvpStatus: "confirmed",
    guestCount: 3,
    note: "Ailesiyle birlikte gelecek",
    source: "website",
  },
  {
    id: "g-004",
    name: "Ayşe Çelik",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=AyseCelik",
    phone: "+90 536 444 5566",
    email: "ayse.celik@email.com",
    rsvpStatus: "pending",
    guestCount: 2,
    note: "Henüz eşine sormadı",
    source: "whatsapp",
  },
  {
    id: "g-005",
    name: "Hasan Öztürk",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=HasanOzturk",
    phone: "+90 537 555 6677",
    email: "hasan.ozturk@email.com",
    rsvpStatus: "declined",
    guestCount: 0,
    note: "O tarihte şehir dışında olacak",
    source: "email",
  },
  {
    id: "g-006",
    name: "Zeynep Arslan",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=ZeynepArslan",
    phone: "+90 538 666 7788",
    email: "zeynep.arslan@email.com",
    rsvpStatus: "confirmed",
    guestCount: 4,
    note: "Çocukları da gelecek",
    source: "qr-code",
  },
  {
    id: "g-007",
    name: "Emre Koç",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=EmreKoc",
    phone: "+90 539 777 8899",
    email: "emre.koc@email.com",
    rsvpStatus: "confirmed",
    guestCount: 2,
    note: "Kız arkadaşıyla gelecek",
    source: "whatsapp",
  },
  {
    id: "g-008",
    name: "Elif Şahin",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=ElifSahin",
    phone: "+90 541 888 9900",
    email: "elif.sahin@email.com",
    rsvpStatus: "pending",
    guestCount: 1,
    note: "İş programını kontrol edecek",
    source: "manual",
  },
  {
    id: "g-009",
    name: "Burak Yıldız",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=BurakYildiz",
    phone: "+90 542 999 0011",
    email: "burak.yildiz@email.com",
    rsvpStatus: "confirmed",
    guestCount: 1,
    note: "",
    source: "website",
  },
  {
    id: "g-010",
    name: "Selin Aydın",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=SelinAydin",
    phone: "+90 543 100 1122",
    email: "selin.aydin@email.com",
    rsvpStatus: "confirmed",
    guestCount: 2,
    note: "Eşiyle gelecek, vejetaryen menü",
    source: "email",
  },
  {
    id: "g-011",
    name: "Oğuz Kılıç",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=OguzKilic",
    phone: "+90 544 200 2233",
    email: "oguz.kilic@email.com",
    rsvpStatus: "declined",
    guestCount: 0,
    note: "Yurt dışında olacak",
    source: "whatsapp",
  },
  {
    id: "g-012",
    name: "Derya Aksoy",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=DeryaAksoy",
    phone: "+90 545 300 3344",
    email: "derya.aksoy@email.com",
    rsvpStatus: "confirmed",
    guestCount: 3,
    note: "Anne ve babasıyla gelecek",
    source: "qr-code",
  },
  {
    id: "g-013",
    name: "Cem Erdoğan",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=CemErdogan",
    phone: "+90 546 400 4455",
    email: "cem.erdogan@email.com",
    rsvpStatus: "pending",
    guestCount: 2,
    note: "",
    source: "website",
  },
  {
    id: "g-014",
    name: "İrem Güneş",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=IremGunes",
    phone: "+90 547 500 5566",
    email: "irem.gunes@email.com",
    rsvpStatus: "confirmed",
    guestCount: 1,
    note: "Glüten alerjisi var",
    source: "manual",
  },
  {
    id: "g-015",
    name: "Tolga Özkan",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=TolgaOzkan",
    phone: "+90 548 600 6677",
    email: "tolga.ozkan@email.com",
    rsvpStatus: "confirmed",
    guestCount: 2,
    note: "Eşiyle birlikte",
    source: "whatsapp",
  },
  {
    id: "g-016",
    name: "Pınar Çetin",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=PinarCetin",
    phone: "+90 549 700 7788",
    email: "pinar.cetin@email.com",
    rsvpStatus: "declined",
    guestCount: 0,
    note: "Başka bir düğünle çakışıyor",
    source: "email",
  },
  {
    id: "g-017",
    name: "Serkan Doğan",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=SerkanDogan",
    phone: "+90 551 800 8899",
    email: "serkan.dogan@email.com",
    rsvpStatus: "confirmed",
    guestCount: 4,
    note: "Tüm aile gelecek",
    source: "qr-code",
  },
  {
    id: "g-018",
    name: "Nisan Korkmaz",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=NisanKorkmaz",
    phone: "+90 552 900 9900",
    email: "nisan.korkmaz@email.com",
    rsvpStatus: "pending",
    guestCount: 1,
    note: "Dönüş bekleniyor",
    source: "whatsapp",
  },
  {
    id: "g-019",
    name: "Barış Ünal",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=BarisUnal",
    phone: "+90 553 010 0112",
    email: "baris.unal@email.com",
    rsvpStatus: "confirmed",
    guestCount: 2,
    note: "Nişanlısıyla gelecek",
    source: "website",
  },
  {
    id: "g-020",
    name: "Gamze Polat",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=GamzePolat",
    phone: "+90 554 121 1223",
    email: "gamze.polat@email.com",
    rsvpStatus: "confirmed",
    guestCount: 1,
    note: "",
    source: "manual",
  },
  {
    id: "g-021",
    name: "Kadir Tunç",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=KadirTunc",
    phone: "+90 555 232 2334",
    email: "kadir.tunc@email.com",
    rsvpStatus: "pending",
    guestCount: 3,
    note: "Çocuklarını getirebilir",
    source: "email",
  },
  {
    id: "g-022",
    name: "Hülya Yalçın",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=HulyaYalcin",
    phone: "+90 556 343 3445",
    email: "hulya.yalcin@email.com",
    rsvpStatus: "confirmed",
    guestCount: 2,
    note: "Kızıyla gelecek",
    source: "whatsapp",
  },
  {
    id: "g-023",
    name: "Murat Acar",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=MuratAcar",
    phone: "+90 557 454 4556",
    email: "murat.acar@email.com",
    rsvpStatus: "declined",
    guestCount: 0,
    note: "İş seyahati nedeniyle katılamayacak",
    source: "qr-code",
  },
  {
    id: "g-024",
    name: "Sibel Taş",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=SibelTas",
    phone: "+90 558 565 5667",
    email: "sibel.tas@email.com",
    rsvpStatus: "confirmed",
    guestCount: 1,
    note: "Vegan menü tercih ediyor",
    source: "website",
  },
  {
    id: "g-025",
    name: "Volkan Başar",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=VolkanBasar",
    phone: "+90 559 676 6778",
    email: "volkan.basar@email.com",
    rsvpStatus: "pending",
    guestCount: 2,
    note: "Eşiyle konuşacak",
    source: "manual",
  },
];

export const recentActivity: Activity[] = [
  {
    id: "a-001",
    name: "Ali Yılmaz",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=AliYilmaz",
    action: "LCV'sini onayladı",
    time: "5 dakika önce",
  },
  {
    id: "a-002",
    name: "Fatma Demir",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=FatmaDemir",
    action: "Davetiyeyi görüntüledi",
    time: "12 dakika önce",
  },
  {
    id: "a-003",
    name: "Mehmet Kaya",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=MehmetKaya",
    action: "3 kişi olarak güncelledi",
    time: "28 dakika önce",
  },
  {
    id: "a-004",
    name: "Zeynep Arslan",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=ZeynepArslan",
    action: "QR kod ile davetiyeyi açtı",
    time: "1 saat önce",
  },
  {
    id: "a-005",
    name: "Hasan Öztürk",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=HasanOzturk",
    action: "Katılamayacağını bildirdi",
    time: "2 saat önce",
  },
  {
    id: "a-006",
    name: "Selin Aydın",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=SelinAydin",
    action: "Vejetaryen menü notu ekledi",
    time: "3 saat önce",
  },
  {
    id: "a-007",
    name: "Emre Koç",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=EmreKoc",
    action: "WhatsApp üzerinden LCV gönderildi",
    time: "5 saat önce",
  },
  {
    id: "a-008",
    name: "Derya Aksoy",
    avatar: "https://api.dicebear.com/9.x/glass/svg?seed=DeryaAksoy",
    action: "Misafir sayısını 3'e güncelledi",
    time: "6 saat önce",
  },
];
