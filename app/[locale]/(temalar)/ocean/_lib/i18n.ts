export type OceanLocale = "tr" | "en" | "de";
interface T {
  navHome: string; navStory: string; navEvent: string; navGallery: string; navMemory: string; navRsvp: string; navLogin: string; bottomMemory: string; bottomRsvp: string;
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
  navHome:"Ana Sayfa",navStory:"Hikayemiz",navEvent:"Etkinlik",navGallery:"Galeri",navMemory:"Anı Defteri",navRsvp:"LCV",navLogin:"Giriş Yap",bottomMemory:"Anı Bırak",bottomRsvp:"Katılım Durumu",
  heroTagline:"İki Kalp, Bir Ufuk",heroCtaButton:"Davetiyeyi Yanıtla",heroScrollHint:"Aşağı Dalış",
  countdownLabel:"Geri Sayım",countdownHeading:"Büyük Dalgaya Doğru",countdownDays:"Gün",countdownHours:"Saat",countdownMinutes:"Dakika",countdownSeconds:"Saniye",
  storyLabel:"Bizim Rotamız",storyText:"Aynı ufka bakan iki yolcu, şimdi aynı limanda demirliyor. Rotamızı sizinle paylaşmak istiyoruz.",storyCtaButton:"Rotayı Takip Edin",
  venueLabel:"Mekân & Etkinlik",venueAddress:"Adres",venueDate:"Tarih",venueTime:"Saat",venueCtaButton:"Detayları Görün",
  galleryLabel:"Galeri",galleryHeading:"Anılar Koleksiyonu",galleryCtaButton:"Tüm Galeriyi Gör",
  galleryUploadHeading:"Fotoğraf Yükle",galleryUploadNamePlaceholder:"Adınız Soyadınız",galleryUploading:"yükleniyor...",galleryUploadSuccess:"fotoğraf başarıyla yüklendi!",galleryUploadError:"fotoğraf yüklenemedi.",galleryEmpty:"Henüz fotoğraf yüklenmedi",galleryEmptySubtitle:"İlk fotoğrafı yükleyen siz olun!",galleryUploadInfo:"Tek seferde en fazla 25 fotoğraf · Maks. 10MB",
  ctaHeading:"Sizi de Bu Yolculuğa Davet Ediyoruz",ctaText:"Hayatımızın en güzel günündeki demirlemede sizi de yanımızda görmekten büyük mutluluk duyacağız.",ctaButton:"Davetiyeyi Yanıtla",
  memoryPageLabel:"Anı Defteri",memoryPageHeading:"Anı Defteri",memoryPageSubtitle:"Geminin güvertesinde bir not bırakın; dileklerinizi ve anılarınızı paylaşın.",memoryApprovalNotice:"Mesajınız düğün sahipleri tarafından onaylandıktan sonra burada görünecektir.",memoryFormHeading:"Bir Anı Bırakın",memoryNamePlaceholder:"Adınız Soyadınız",memoryMessagePlaceholder:"Çifte güzel dileklerinizi yazın...",memorySubmitButton:"Gönder",memorySubmitting:"Gönderiliyor...",memorySuccessToast:"Mesajınız kaydedildi!",memoryErrorToast:"Bir hata oluştu. Tekrar deneyin.",memoryNameRequired:"Lütfen adınızı girin.",memoryMessageRequired:"Lütfen bir mesaj yazın.",memoryPendingBadge:"Onay Bekliyor",memoryEmptyTitle:"Henüz bir anı yazılmadı",memoryEmptySubtitle:"İlk anıyı yazan siz olun!",memoryMessagesHeading:"Paylaşılan Anılar",memoryTimeJustNow:"Az önce",memoryTimeMinutes:"dakika önce",memoryTimeHours:"saat önce",memoryTimeDays:"gün önce",memoryTimeWeeks:"hafta önce",
  rsvpAttending:"Katılacağım",rsvpNotAttending:"Katılamayacağım",rsvpNamePlaceholder:"Adınızı girin",rsvpPhonePlaceholder:"Telefon numaranız (isteğe bağlı)",rsvpAttendanceLabel:"Katılım Durumu",rsvpAdditionalGuests:"Ek Misafirler",rsvpAddGuest:"Misafir Ekle",rsvpGuestPlaceholder:"Misafir adı",rsvpNotePlaceholder:"Bir notunuz var mı? (isteğe bağlı)",rsvpSubmit:"Gönder",rsvpSubmitting:"Gönderiliyor...",rsvpSuccessTitle:"Teşekkür Ederiz!",rsvpSuccessMessage:"LCV'niz kaydedildi. Sizi güvertede görmekten mutluluk duyacağız.",rsvpNameRequired:"Lütfen adınızı girin.",rsvpSuccessToast:"LCV'niz başarıyla kaydedildi!",rsvpErrorToast:"Bir hata oluştu. Tekrar deneyin.",
  eventLabel:"Etkinlik Bilgileri",eventScheduleHeading:"Etkinlik Programı",eventFamilyHeading:"Aileler",eventBrideFamily:"Gelin Ailesi",eventGroomFamily:"Damat Ailesi",eventDressCode:"Nautical / Denizci Şıklığı",
  contactLabel:"İletişim",contactText:"Düğünümüzle ilgili sorularınız için bizimle iletişime geçebilirsiniz.",contactCtaButton:"LCV'nizi Doldurun",
  footerCreatedWith:"ile oluşturuldu",footerCtaHeading:"Siz de böyle bir davetiye ister misiniz?",footerCtaText:"Kendi düğün web sitenizi dakikalar içinde oluşturun.",footerCtaButton:"Hemen Başla",footerPrivacy:"Gizlilik",footerRights:"Tüm hakları saklıdır.",
};
const en: T = {
  navHome:"Home",navStory:"Our Story",navEvent:"Event",navGallery:"Gallery",navMemory:"Guestbook",navRsvp:"RSVP",navLogin:"Sign In",bottomMemory:"Leave Memory",bottomRsvp:"Attendance",
  heroTagline:"Two Hearts, One Horizon",heroCtaButton:"RSVP Now",heroScrollHint:"Dive In",
  countdownLabel:"Countdown",countdownHeading:"Sailing Toward the Big Day",countdownDays:"Days",countdownHours:"Hours",countdownMinutes:"Minutes",countdownSeconds:"Seconds",
  storyLabel:"Our Voyage",storyText:"Two travelers looking at the same horizon, now docking in the same harbor. We'd love to share our voyage with you.",storyCtaButton:"Follow Our Route",
  venueLabel:"Venue & Event",venueAddress:"Address",venueDate:"Date",venueTime:"Time",venueCtaButton:"View Details",
  galleryLabel:"Gallery",galleryHeading:"Collected Memories",galleryCtaButton:"View Full Gallery",
  galleryUploadHeading:"Upload Photo",galleryUploadNamePlaceholder:"Your Full Name",galleryUploading:"uploading...",galleryUploadSuccess:"photo uploaded!",galleryUploadError:"upload failed.",galleryEmpty:"No photos yet",galleryEmptySubtitle:"Be the first!",galleryUploadInfo:"Up to 25 photos · Max 10MB",
  ctaHeading:"Join Our Voyage",ctaText:"We would be delighted to have you aboard for the most beautiful day of our lives.",ctaButton:"RSVP Now",
  memoryPageLabel:"Guestbook",memoryPageHeading:"Guestbook",memoryPageSubtitle:"Leave a note on the deck; share your memories and wishes.",memoryApprovalNotice:"Your message will appear after approval.",memoryFormHeading:"Leave a Memory",memoryNamePlaceholder:"Your Full Name",memoryMessagePlaceholder:"Write your wishes...",memorySubmitButton:"Send",memorySubmitting:"Sending...",memorySuccessToast:"Message saved!",memoryErrorToast:"Something went wrong.",memoryNameRequired:"Please enter your name.",memoryMessageRequired:"Please enter a message.",memoryPendingBadge:"Pending",memoryEmptyTitle:"No memories yet",memoryEmptySubtitle:"Be the first!",memoryMessagesHeading:"Shared Memories",memoryTimeJustNow:"Just now",memoryTimeMinutes:"min ago",memoryTimeHours:"hours ago",memoryTimeDays:"days ago",memoryTimeWeeks:"weeks ago",
  rsvpAttending:"I'll Attend",rsvpNotAttending:"Can't Attend",rsvpNamePlaceholder:"Your name",rsvpPhonePlaceholder:"Phone (optional)",rsvpAttendanceLabel:"Attendance",rsvpAdditionalGuests:"Additional Guests",rsvpAddGuest:"Add Guest",rsvpGuestPlaceholder:"Guest name",rsvpNotePlaceholder:"Any notes? (optional)",rsvpSubmit:"Submit",rsvpSubmitting:"Submitting...",rsvpSuccessTitle:"Thank You!",rsvpSuccessMessage:"Your RSVP has been recorded.",rsvpNameRequired:"Please enter your name.",rsvpSuccessToast:"RSVP saved!",rsvpErrorToast:"Something went wrong.",
  eventLabel:"Event Details",eventScheduleHeading:"Schedule",eventFamilyHeading:"Families",eventBrideFamily:"Bride's Family",eventGroomFamily:"Groom's Family",eventDressCode:"Nautical Chic",
  contactLabel:"Contact",contactText:"Feel free to reach out with any questions.",contactCtaButton:"RSVP Now",
  footerCreatedWith:"created with",footerCtaHeading:"Want an invitation like this?",footerCtaText:"Create your wedding website in minutes.",footerCtaButton:"Get Started",footerPrivacy:"Privacy",footerRights:"All rights reserved.",
};
const de: T = {
  navHome:"Startseite",navStory:"Geschichte",navEvent:"Event",navGallery:"Galerie",navMemory:"Gästebuch",navRsvp:"RSVP",navLogin:"Anmelden",bottomMemory:"Erinnerung",bottomRsvp:"Teilnahme",
  heroTagline:"Zwei Herzen, ein Horizont",heroCtaButton:"Jetzt antworten",heroScrollHint:"Eintauchen",
  countdownLabel:"Countdown",countdownHeading:"Kurs auf den großen Tag",countdownDays:"Tage",countdownHours:"Stunden",countdownMinutes:"Minuten",countdownSeconds:"Sekunden",
  storyLabel:"Unsere Reise",storyText:"Zwei Reisende mit demselben Horizont, jetzt im selben Hafen.",storyCtaButton:"Route folgen",
  venueLabel:"Ort & Event",venueAddress:"Adresse",venueDate:"Datum",venueTime:"Uhrzeit",venueCtaButton:"Details",
  galleryLabel:"Galerie",galleryHeading:"Gesammelte Erinnerungen",galleryCtaButton:"Gesamte Galerie",
  galleryUploadHeading:"Foto hochladen",galleryUploadNamePlaceholder:"Ihr Name",galleryUploading:"wird hochgeladen...",galleryUploadSuccess:"Hochgeladen!",galleryUploadError:"Fehler.",galleryEmpty:"Noch keine Fotos",galleryEmptySubtitle:"Seien Sie der Erste!",galleryUploadInfo:"Bis zu 25 Fotos · Max 10MB",
  ctaHeading:"Kommen Sie an Bord",ctaText:"Wir freuen uns, Sie an diesem Tag dabei zu haben.",ctaButton:"Jetzt antworten",
  memoryPageLabel:"Gästebuch",memoryPageHeading:"Gästebuch",memoryPageSubtitle:"Hinterlassen Sie eine Notiz an Deck.",memoryApprovalNotice:"Nach Genehmigung sichtbar.",memoryFormHeading:"Erinnerung hinterlassen",memoryNamePlaceholder:"Ihr Name",memoryMessagePlaceholder:"Ihre Wünsche...",memorySubmitButton:"Senden",memorySubmitting:"Wird gesendet...",memorySuccessToast:"Gespeichert!",memoryErrorToast:"Fehler.",memoryNameRequired:"Name eingeben.",memoryMessageRequired:"Nachricht eingeben.",memoryPendingBadge:"Ausstehend",memoryEmptyTitle:"Noch keine Einträge",memoryEmptySubtitle:"Seien Sie der Erste!",memoryMessagesHeading:"Geteilte Erinnerungen",memoryTimeJustNow:"Gerade",memoryTimeMinutes:"Min. her",memoryTimeHours:"Std. her",memoryTimeDays:"Tage her",memoryTimeWeeks:"Wochen her",
  rsvpAttending:"Ich nehme teil",rsvpNotAttending:"Kann nicht",rsvpNamePlaceholder:"Name",rsvpPhonePlaceholder:"Telefon (optional)",rsvpAttendanceLabel:"Teilnahme",rsvpAdditionalGuests:"Weitere Gäste",rsvpAddGuest:"Gast hinzufügen",rsvpGuestPlaceholder:"Gastname",rsvpNotePlaceholder:"Notiz? (optional)",rsvpSubmit:"Absenden",rsvpSubmitting:"Wird gesendet...",rsvpSuccessTitle:"Danke!",rsvpSuccessMessage:"RSVP gespeichert.",rsvpNameRequired:"Name eingeben.",rsvpSuccessToast:"RSVP gespeichert!",rsvpErrorToast:"Fehler.",
  eventLabel:"Veranstaltung",eventScheduleHeading:"Programm",eventFamilyHeading:"Familien",eventBrideFamily:"Familie der Braut",eventGroomFamily:"Familie des Bräutigams",eventDressCode:"Nautical Chic",
  contactLabel:"Kontakt",contactText:"Bei Fragen kontaktieren Sie uns.",contactCtaButton:"Jetzt antworten",
  footerCreatedWith:"erstellt mit",footerCtaHeading:"Auch so eine Einladung?",footerCtaText:"Hochzeitswebsite erstellen.",footerCtaButton:"Jetzt starten",footerPrivacy:"Datenschutz",footerRights:"Alle Rechte vorbehalten.",
};
const translations: Record<OceanLocale, T> = { tr, en, de };
let currentLocale: OceanLocale = "tr";
export function setOceanLocale(locale: OceanLocale) { currentLocale = locale; }
export function t(key: keyof T): string { return translations[currentLocale][key] || translations.tr[key] || key; }
export function getTranslations(locale: OceanLocale): T { return translations[locale] || translations.tr; }
