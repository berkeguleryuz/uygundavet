export type GardenLocale = "tr" | "en" | "de";
interface T {
  navHome: string; navStory: string; navEvent: string; navGallery: string; navMemory: string; navRsvp: string; navLogin: string;
  heroTagline: string; heroCtaButton: string; heroScrollHint: string;
  countdownLabel: string; countdownHeading: string; countdownDays: string; countdownHours: string; countdownMinutes: string; countdownSeconds: string;
  storyLabel: string; storyText: string; storyCtaButton: string;
  venueLabel: string; venueAddress: string; venueDate: string; venueTime: string; venueCtaButton: string;
  galleryLabel: string; galleryHeading: string; galleryCtaButton: string;
  galleryUploadHeading: string; galleryUploadNamePlaceholder: string; galleryUploading: string; galleryUploadSuccess: string; galleryUploadError: string; galleryEmpty: string; galleryEmptySubtitle: string; galleryUploadInfo: string;
  ctaHeading: string; ctaText: string; ctaButton: string;
  memoryPageLabel: string; memoryPageHeading: string; memoryPageSubtitle: string; memoryApprovalNotice: string; memoryFormHeading: string; memoryNamePlaceholder: string; memoryMessagePlaceholder: string; memorySubmitButton: string; memorySubmitting: string; memorySuccessToast: string; memoryErrorToast: string; memoryNameRequired: string; memoryMessageRequired: string; memoryPendingBadge: string; memoryEmptyTitle: string; memoryEmptySubtitle: string; memoryMessagesHeading: string; memoryTimeJustNow: string; memoryTimeMinutes: string; memoryTimeHours: string; memoryTimeDays: string; memoryTimeWeeks: string;
  rsvpAttending: string; rsvpNotAttending: string; rsvpNamePlaceholder: string; rsvpPhonePlaceholder: string; rsvpAttendanceLabel: string; rsvpAdditionalGuests: string; rsvpAddGuest: string; rsvpGuestPlaceholder: string; rsvpNotePlaceholder: string; rsvpSubmit: string; rsvpSubmitting: string; rsvpSuccessTitle: string; rsvpSuccessMessage: string; rsvpNameRequired: string; rsvpSuccessToast: string; rsvpErrorToast: string;
  eventLabel: string; eventScheduleHeading: string; eventFamilyHeading: string; eventBrideFamily: string; eventGroomFamily: string; eventDressCode: string;
  contactLabel: string; contactText: string; contactCtaButton: string;
  footerCreatedWith: string; footerCtaHeading: string; footerCtaText: string; footerCtaButton: string; footerPrivacy: string; footerRights: string;
}
const tr: T = {
  navHome:"Ana Sayfa",navStory:"Hikayemiz",navEvent:"Etkinlik",navGallery:"Galeri",navMemory:"Anı Defteri",navRsvp:"LCV",navLogin:"Giriş Yap",
  heroTagline:"Sevgi Filizleniyor",heroCtaButton:"Davetiyeyi Yanıtla",heroScrollHint:"Keşfet",
  countdownLabel:"Geri Sayım",countdownHeading:"Mevsimimiz Yaklaşıyor",countdownDays:"Gün",countdownHours:"Saat",countdownMinutes:"Dakika",countdownSeconds:"Saniye",
  storyLabel:"Büyüyen Hikâye",storyText:"İki kalbin bahçesinde filizlenen bu sevda, şimdi sizinle paylaşılmaya hazır.",storyCtaButton:"Hikayemizi Okuyun",
  venueLabel:"Mekân & Etkinlik",venueAddress:"Adres",venueDate:"Tarih",venueTime:"Saat",venueCtaButton:"Detayları Görün",
  galleryLabel:"Galeri",galleryHeading:"Anılarımızın Bahçesi",galleryCtaButton:"Tüm Galeriyi Gör",
  galleryUploadHeading:"Fotoğraf Yükle",galleryUploadNamePlaceholder:"Adınız Soyadınız",galleryUploading:"yükleniyor...",galleryUploadSuccess:"fotoğraf başarıyla yüklendi!",galleryUploadError:"fotoğraf yüklenemedi.",galleryEmpty:"Henüz fotoğraf yüklenmedi",galleryEmptySubtitle:"İlk fotoğrafı yükleyen siz olun!",galleryUploadInfo:"Tek seferde en fazla 25 fotoğraf · Maks. 10MB",
  ctaHeading:"Sizi Bahçemizde Bekliyoruz",ctaText:"Hayatımızın en güzel gününde bu filizin açtığı çiçeğin tadını birlikte çıkarmaktan büyük mutluluk duyacağız.",ctaButton:"Davetiyeyi Yanıtla",
  memoryPageLabel:"Anı Defteri",memoryPageHeading:"Anı Defteri",memoryPageSubtitle:"Bu bahçeye bir fidan da siz bırakın; güzel dileklerinizi ve anılarınızı paylaşın.",memoryApprovalNotice:"Mesajınız düğün sahipleri tarafından onaylandıktan sonra burada görünecektir.",memoryFormHeading:"Bir Anı Bırakın",memoryNamePlaceholder:"Adınız Soyadınız",memoryMessagePlaceholder:"Çifte güzel dileklerinizi yazın...",memorySubmitButton:"Gönder",memorySubmitting:"Gönderiliyor...",memorySuccessToast:"Mesajınız kaydedildi!",memoryErrorToast:"Bir hata oluştu. Tekrar deneyin.",memoryNameRequired:"Lütfen adınızı girin.",memoryMessageRequired:"Lütfen bir mesaj yazın.",memoryPendingBadge:"Onay Bekliyor",memoryEmptyTitle:"Henüz bir anı yazılmadı",memoryEmptySubtitle:"İlk anıyı yazan siz olun!",memoryMessagesHeading:"Paylaşılan Anılar",memoryTimeJustNow:"Az önce",memoryTimeMinutes:"dakika önce",memoryTimeHours:"saat önce",memoryTimeDays:"gün önce",memoryTimeWeeks:"hafta önce",
  rsvpAttending:"Katılacağım",rsvpNotAttending:"Katılamayacağım",rsvpNamePlaceholder:"Adınızı girin",rsvpPhonePlaceholder:"Telefon numaranız (isteğe bağlı)",rsvpAttendanceLabel:"Katılım Durumu",rsvpAdditionalGuests:"Ek Misafirler",rsvpAddGuest:"Misafir Ekle",rsvpGuestPlaceholder:"Misafir adı",rsvpNotePlaceholder:"Bir notunuz var mı? (isteğe bağlı)",rsvpSubmit:"Gönder",rsvpSubmitting:"Gönderiliyor...",rsvpSuccessTitle:"Teşekkür Ederiz!",rsvpSuccessMessage:"LCV'niz kaydedildi. Sizi bahçemizde görmekten mutluluk duyacağız.",rsvpNameRequired:"Lütfen adınızı girin.",rsvpSuccessToast:"LCV'niz başarıyla kaydedildi!",rsvpErrorToast:"Bir hata oluştu. Tekrar deneyin.",
  eventLabel:"Etkinlik Bilgileri",eventScheduleHeading:"Etkinlik Programı",eventFamilyHeading:"Aileler",eventBrideFamily:"Gelin Ailesi",eventGroomFamily:"Damat Ailesi",eventDressCode:"Bahçe / Garden Chic",
  contactLabel:"İletişim",contactText:"Düğünümüzle ilgili sorularınız için bizimle iletişime geçebilirsiniz.",contactCtaButton:"LCV'nizi Doldurun",
  footerCreatedWith:"ile oluşturuldu",footerCtaHeading:"Siz de böyle bir davetiye ister misiniz?",footerCtaText:"Kendi düğün web sitenizi dakikalar içinde oluşturun.",footerCtaButton:"Hemen Başla",footerPrivacy:"Gizlilik",footerRights:"Tüm hakları saklıdır.",
};
const en: T = {
  navHome:"Home",navStory:"Our Story",navEvent:"Event",navGallery:"Gallery",navMemory:"Guestbook",navRsvp:"RSVP",navLogin:"Sign In",
  heroTagline:"Love in Full Bloom",heroCtaButton:"RSVP Now",heroScrollHint:"Explore",
  countdownLabel:"Countdown",countdownHeading:"Our Season Approaches",countdownDays:"Days",countdownHours:"Hours",countdownMinutes:"Minutes",countdownSeconds:"Seconds",
  storyLabel:"How It Grew",storyText:"A love that sprouted in the garden of two hearts, now ready to bloom with you.",storyCtaButton:"Read Our Story",
  venueLabel:"Venue & Event",venueAddress:"Address",venueDate:"Date",venueTime:"Time",venueCtaButton:"View Details",
  galleryLabel:"Gallery",galleryHeading:"Our Garden of Memories",galleryCtaButton:"View Full Gallery",
  galleryUploadHeading:"Upload Photo",galleryUploadNamePlaceholder:"Your Full Name",galleryUploading:"uploading...",galleryUploadSuccess:"photo uploaded!",galleryUploadError:"upload failed.",galleryEmpty:"No photos yet",galleryEmptySubtitle:"Be the first!",galleryUploadInfo:"Up to 25 photos · Max 10MB",
  ctaHeading:"Come Bloom With Us",ctaText:"We would be delighted to share this beautiful day with you in our garden of love.",ctaButton:"RSVP Now",
  memoryPageLabel:"Guestbook",memoryPageHeading:"Guestbook",memoryPageSubtitle:"Plant a seedling in our garden; share your memories and wishes.",memoryApprovalNotice:"Your message will appear after approval.",memoryFormHeading:"Leave a Memory",memoryNamePlaceholder:"Your Full Name",memoryMessagePlaceholder:"Write your wishes...",memorySubmitButton:"Send",memorySubmitting:"Sending...",memorySuccessToast:"Message saved!",memoryErrorToast:"Something went wrong.",memoryNameRequired:"Please enter your name.",memoryMessageRequired:"Please enter a message.",memoryPendingBadge:"Pending",memoryEmptyTitle:"No memories yet",memoryEmptySubtitle:"Be the first!",memoryMessagesHeading:"Shared Memories",memoryTimeJustNow:"Just now",memoryTimeMinutes:"min ago",memoryTimeHours:"hours ago",memoryTimeDays:"days ago",memoryTimeWeeks:"weeks ago",
  rsvpAttending:"I'll Attend",rsvpNotAttending:"Can't Attend",rsvpNamePlaceholder:"Your name",rsvpPhonePlaceholder:"Phone (optional)",rsvpAttendanceLabel:"Attendance",rsvpAdditionalGuests:"Additional Guests",rsvpAddGuest:"Add Guest",rsvpGuestPlaceholder:"Guest name",rsvpNotePlaceholder:"Any notes? (optional)",rsvpSubmit:"Submit",rsvpSubmitting:"Submitting...",rsvpSuccessTitle:"Thank You!",rsvpSuccessMessage:"Your RSVP has been recorded.",rsvpNameRequired:"Please enter your name.",rsvpSuccessToast:"RSVP saved!",rsvpErrorToast:"Something went wrong.",
  eventLabel:"Event Details",eventScheduleHeading:"Schedule",eventFamilyHeading:"Families",eventBrideFamily:"Bride's Family",eventGroomFamily:"Groom's Family",eventDressCode:"Garden Chic",
  contactLabel:"Contact",contactText:"Feel free to reach out with any questions.",contactCtaButton:"RSVP Now",
  footerCreatedWith:"created with",footerCtaHeading:"Want an invitation like this?",footerCtaText:"Create your wedding website in minutes.",footerCtaButton:"Get Started",footerPrivacy:"Privacy",footerRights:"All rights reserved.",
};
const de: T = {
  navHome:"Startseite",navStory:"Geschichte",navEvent:"Event",navGallery:"Galerie",navMemory:"Gästebuch",navRsvp:"RSVP",navLogin:"Anmelden",
  heroTagline:"Liebe in voller Blüte",heroCtaButton:"Jetzt antworten",heroScrollHint:"Entdecken",
  countdownLabel:"Countdown",countdownHeading:"Unsere Jahreszeit naht",countdownDays:"Tage",countdownHours:"Stunden",countdownMinutes:"Minuten",countdownSeconds:"Sekunden",
  storyLabel:"Unsere Geschichte",storyText:"Eine Liebe, die im Garten zweier Herzen aufblüht.",storyCtaButton:"Geschichte lesen",
  venueLabel:"Ort & Event",venueAddress:"Adresse",venueDate:"Datum",venueTime:"Uhrzeit",venueCtaButton:"Details",
  galleryLabel:"Galerie",galleryHeading:"Unser Garten der Erinnerungen",galleryCtaButton:"Gesamte Galerie",
  galleryUploadHeading:"Foto hochladen",galleryUploadNamePlaceholder:"Ihr Name",galleryUploading:"wird hochgeladen...",galleryUploadSuccess:"Hochgeladen!",galleryUploadError:"Fehler.",galleryEmpty:"Noch keine Fotos",galleryEmptySubtitle:"Seien Sie der Erste!",galleryUploadInfo:"Bis zu 25 Fotos · Max 10MB",
  ctaHeading:"Blühen Sie mit uns",ctaText:"Wir freuen uns, diesen Tag mit Ihnen zu teilen.",ctaButton:"Jetzt antworten",
  memoryPageLabel:"Gästebuch",memoryPageHeading:"Gästebuch",memoryPageSubtitle:"Pflanzen Sie einen Setzling in unseren Garten.",memoryApprovalNotice:"Nach Genehmigung sichtbar.",memoryFormHeading:"Erinnerung hinterlassen",memoryNamePlaceholder:"Ihr Name",memoryMessagePlaceholder:"Ihre Wünsche...",memorySubmitButton:"Senden",memorySubmitting:"Wird gesendet...",memorySuccessToast:"Gespeichert!",memoryErrorToast:"Fehler.",memoryNameRequired:"Name eingeben.",memoryMessageRequired:"Nachricht eingeben.",memoryPendingBadge:"Ausstehend",memoryEmptyTitle:"Noch keine Einträge",memoryEmptySubtitle:"Seien Sie der Erste!",memoryMessagesHeading:"Geteilte Erinnerungen",memoryTimeJustNow:"Gerade",memoryTimeMinutes:"Min. her",memoryTimeHours:"Std. her",memoryTimeDays:"Tage her",memoryTimeWeeks:"Wochen her",
  rsvpAttending:"Ich nehme teil",rsvpNotAttending:"Kann nicht",rsvpNamePlaceholder:"Name",rsvpPhonePlaceholder:"Telefon (optional)",rsvpAttendanceLabel:"Teilnahme",rsvpAdditionalGuests:"Weitere Gäste",rsvpAddGuest:"Gast hinzufügen",rsvpGuestPlaceholder:"Gastname",rsvpNotePlaceholder:"Notiz? (optional)",rsvpSubmit:"Absenden",rsvpSubmitting:"Wird gesendet...",rsvpSuccessTitle:"Danke!",rsvpSuccessMessage:"RSVP gespeichert.",rsvpNameRequired:"Name eingeben.",rsvpSuccessToast:"RSVP gespeichert!",rsvpErrorToast:"Fehler.",
  eventLabel:"Veranstaltung",eventScheduleHeading:"Programm",eventFamilyHeading:"Familien",eventBrideFamily:"Familie der Braut",eventGroomFamily:"Familie des Bräutigams",eventDressCode:"Garden Chic",
  contactLabel:"Kontakt",contactText:"Bei Fragen kontaktieren Sie uns.",contactCtaButton:"Jetzt antworten",
  footerCreatedWith:"erstellt mit",footerCtaHeading:"Auch so eine Einladung?",footerCtaText:"Hochzeitswebsite erstellen.",footerCtaButton:"Jetzt starten",footerPrivacy:"Datenschutz",footerRights:"Alle Rechte vorbehalten.",
};
const translations: Record<GardenLocale, T> = { tr, en, de };
let currentLocale: GardenLocale = "tr";
export function setGardenLocale(locale: GardenLocale) { currentLocale = locale; }
export function t(key: keyof T): string { return translations[currentLocale][key] || translations.tr[key] || key; }
export function getTranslations(locale: GardenLocale): T { return translations[locale] || translations.tr; }
