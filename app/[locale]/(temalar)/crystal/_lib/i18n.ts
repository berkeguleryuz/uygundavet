export type CrystalLocale = "tr" | "en" | "de";

interface CrystalTranslations {
  navHome: string;
  navStory: string;
  navEvent: string;
  navGallery: string;
  navMemory: string;
  navRsvp: string;
  navLogin: string;
  bottomMemory: string;
  bottomRsvp: string;
  heroTagline: string;
  heroCtaButton: string;
  heroScrollHint: string;
  countdownLabel: string;
  countdownHeading: string;
  countdownDays: string;
  countdownHours: string;
  countdownMinutes: string;
  countdownSeconds: string;
  storyLabel: string;
  storyText: string;
  storyCtaButton: string;
  venueLabel: string;
  venueAddress: string;
  venueDate: string;
  venueTime: string;
  venueCtaButton: string;
  galleryLabel: string;
  galleryHeading: string;
  galleryCtaButton: string;
  ctaHeading: string;
  ctaText: string;
  ctaButton: string;
  memoryPageLabel: string;
  memoryPageHeading: string;
  memoryPageSubtitle: string;
  memoryApprovalNotice: string;
  memoryFormHeading: string;
  memoryNamePlaceholder: string;
  memoryMessagePlaceholder: string;
  memorySubmitButton: string;
  memorySubmitting: string;
  memorySuccessToast: string;
  memoryErrorToast: string;
  memoryNameRequired: string;
  memoryMessageRequired: string;
  memoryPendingBadge: string;
  memoryEmptyTitle: string;
  memoryEmptySubtitle: string;
  memoryMessagesHeading: string;
  memoryTimeJustNow: string;
  memoryTimeMinutes: string;
  memoryTimeHours: string;
  memoryTimeDays: string;
  memoryTimeWeeks: string;
  rsvpAttending: string;
  rsvpNotAttending: string;
  rsvpNamePlaceholder: string;
  rsvpPhonePlaceholder: string;
  rsvpAttendanceLabel: string;
  rsvpAdditionalGuests: string;
  rsvpAddGuest: string;
  rsvpGuestPlaceholder: string;
  rsvpNotePlaceholder: string;
  rsvpSubmit: string;
  rsvpSubmitting: string;
  rsvpSuccessTitle: string;
  rsvpSuccessMessage: string;
  rsvpNameRequired: string;
  rsvpSuccessToast: string;
  rsvpErrorToast: string;
  galleryUploadHeading: string;
  galleryUploadNamePlaceholder: string;
  galleryUploading: string;
  galleryUploadSuccess: string;
  galleryUploadError: string;
  galleryEmpty: string;
  galleryEmptySubtitle: string;
  galleryUploadInfo: string;
  eventLabel: string;
  eventScheduleHeading: string;
  eventFamilyHeading: string;
  eventBrideFamily: string;
  eventGroomFamily: string;
  eventDressCode: string;
  contactLabel: string;
  contactText: string;
  contactCtaButton: string;
  footerCreatedWith: string;
  footerCtaHeading: string;
  footerCtaText: string;
  footerCtaButton: string;
  footerPrivacy: string;
  footerRights: string;
}

const translations: Record<CrystalLocale, CrystalTranslations> = {
  tr: {
    navHome: "Ana Sayfa",
    navStory: "Hikayemiz",
    navEvent: "Etkinlik",
    navGallery: "Galeri",
    navMemory: "Anı Defteri",
    navRsvp: "LCV",
    navLogin: "Giriş Yap",
    bottomMemory: "Anı Bırak",
    bottomRsvp: "Katılım Durumu",
    heroTagline: "Evleniyoruz",
    heroCtaButton: "Davetiyeyi Yanıtla",
    heroScrollHint: "Keşfet",
    countdownLabel: "Geri Sayım",
    countdownHeading: "Büyük Gün Yaklaşıyor",
    countdownDays: "Gün",
    countdownHours: "Saat",
    countdownMinutes: "Dakika",
    countdownSeconds: "Saniye",
    storyLabel: "Hikayemiz",
    storyText: "Hayatlarımızı birleştirmeye karar verdik. Bu yolculuğun hikâyesini sizinle paylaşmak istiyoruz.",
    storyCtaButton: "Hikayemizi Okuyun",
    venueLabel: "Mekan & Etkinlik",
    venueAddress: "Adres",
    venueDate: "Tarih",
    venueTime: "Saat",
    venueCtaButton: "Detayları Görün",
    galleryLabel: "Galeri",
    galleryHeading: "Anılarımız",
    galleryCtaButton: "Tüm Galeriyi Gör",
    ctaHeading: "Sizi de Bekliyoruz",
    ctaText: "Hayatımızın en güzel gününde sizi de aramızda görmekten büyük mutluluk duyacağız.",
    ctaButton: "Davetiyeyi Yanıtla",
    memoryPageLabel: "Anı Defteri",
    memoryPageHeading: "Anı Defteri",
    memoryPageSubtitle: "Bizimle güzel anılarınızı ve dileklerinizi paylaşın.",
    memoryApprovalNotice: "Mesajınız düğün sahipleri tarafından onaylandıktan sonra burada görünecektir.",
    memoryFormHeading: "Bir Anı Bırakın",
    memoryNamePlaceholder: "Adınız Soyadınız",
    memoryMessagePlaceholder: "Çifte güzel dileklerinizi yazın...",
    memorySubmitButton: "Gönder",
    memorySubmitting: "Gönderiliyor...",
    memorySuccessToast: "Mesajınız kaydedildi!",
    memoryErrorToast: "Bir hata oluştu. Tekrar deneyin.",
    memoryNameRequired: "Lütfen adınızı girin.",
    memoryMessageRequired: "Lütfen bir mesaj yazın.",
    memoryPendingBadge: "Onay Bekliyor",
    memoryEmptyTitle: "Henüz bir anı yazılmadı",
    memoryEmptySubtitle: "İlk anıyı yazan siz olun!",
    memoryMessagesHeading: "Paylaşılan Anılar",
    memoryTimeJustNow: "Az önce",
    memoryTimeMinutes: "dakika önce",
    memoryTimeHours: "saat önce",
    memoryTimeDays: "gün önce",
    memoryTimeWeeks: "hafta önce",
    rsvpAttending: "Katılacağım",
    rsvpNotAttending: "Katılamayacağım",
    rsvpNamePlaceholder: "Adınızı girin",
    rsvpPhonePlaceholder: "Telefon numaranız (isteğe bağlı)",
    rsvpAttendanceLabel: "Katılım Durumu",
    rsvpAdditionalGuests: "Ek Misafirler",
    rsvpAddGuest: "Misafir Ekle",
    rsvpGuestPlaceholder: "Misafir adı",
    rsvpNotePlaceholder: "Bir notunuz var mı? (isteğe bağlı)",
    rsvpSubmit: "Gönder",
    rsvpSubmitting: "Gönderiliyor...",
    rsvpSuccessTitle: "Teşekkür Ederiz!",
    rsvpSuccessMessage: "LCV'niz kaydedildi. Sizi aramızda görmekten mutluluk duyacağız.",
    rsvpNameRequired: "Lütfen adınızı girin.",
    rsvpSuccessToast: "LCV'niz başarıyla kaydedildi!",
    rsvpErrorToast: "Bir hata oluştu. Tekrar deneyin.",
    galleryUploadHeading: "Fotoğraf Yükle",
    galleryUploadNamePlaceholder: "Adınız Soyadınız",
    galleryUploading: "yükleniyor...",
    galleryUploadSuccess: "fotoğraf başarıyla yüklendi!",
    galleryUploadError: "fotoğraf yüklenemedi.",
    galleryEmpty: "Henüz fotoğraf yüklenmedi",
    galleryEmptySubtitle: "İlk fotoğrafı yükleyen siz olun!",
    galleryUploadInfo: "Tek seferde en fazla 25 fotoğraf · Maks. 10MB",
    eventLabel: "Etkinlik Bilgileri",
    eventScheduleHeading: "Etkinlik Programı",
    eventFamilyHeading: "Aileler",
    eventBrideFamily: "Gelin Ailesi",
    eventGroomFamily: "Damat Ailesi",
    eventDressCode: "Resmi / Formal",
    contactLabel: "İletişim",
    contactText: "Düğünümüzle ilgili sorularınız için bizimle iletişime geçebilirsiniz.",
    contactCtaButton: "LCV'nizi Doldurun",
    footerCreatedWith: "ile oluşturuldu",
    footerCtaHeading: "Siz de böyle bir davetiye ister misiniz?",
    footerCtaText: "Kendi düğün web sitenizi dakikalar içinde oluşturun.",
    footerCtaButton: "Hemen Başla",
    footerPrivacy: "Gizlilik",
    footerRights: "Tüm hakları saklıdır.",
  },
  en: {
    navHome: "Home",
    navStory: "Our Story",
    navEvent: "Event",
    navGallery: "Gallery",
    navMemory: "Guestbook",
    navRsvp: "RSVP",
    navLogin: "Sign In",
    bottomMemory: "Leave Memory",
    bottomRsvp: "Attendance",
    heroTagline: "We're Getting Married",
    heroCtaButton: "RSVP Now",
    heroScrollHint: "Discover",
    countdownLabel: "Countdown",
    countdownHeading: "The Big Day Is Coming",
    countdownDays: "Days",
    countdownHours: "Hours",
    countdownMinutes: "Minutes",
    countdownSeconds: "Seconds",
    storyLabel: "Our Story",
    storyText: "We decided to spend our lives together. We want to share this journey with you.",
    storyCtaButton: "Read Our Story",
    venueLabel: "Venue & Event",
    venueAddress: "Address",
    venueDate: "Date",
    venueTime: "Time",
    venueCtaButton: "View Details",
    galleryLabel: "Gallery",
    galleryHeading: "Our Memories",
    galleryCtaButton: "View Full Gallery",
    ctaHeading: "We're Waiting For You",
    ctaText: "We would be delighted to have you with us on the most beautiful day of our lives.",
    ctaButton: "RSVP Now",
    memoryPageLabel: "Guestbook",
    memoryPageHeading: "Guestbook",
    memoryPageSubtitle: "Share your beautiful memories and wishes with us.",
    memoryApprovalNotice: "Your message will appear here after being approved by the couple.",
    memoryFormHeading: "Leave a Memory",
    memoryNamePlaceholder: "Your Full Name",
    memoryMessagePlaceholder: "Write your wishes for the couple...",
    memorySubmitButton: "Send",
    memorySubmitting: "Sending...",
    memorySuccessToast: "Your message has been saved!",
    memoryErrorToast: "Something went wrong. Please try again.",
    memoryNameRequired: "Please enter your name.",
    memoryMessageRequired: "Please enter a message.",
    memoryPendingBadge: "Pending Approval",
    memoryEmptyTitle: "No memories yet",
    memoryEmptySubtitle: "Be the first to leave a memory!",
    memoryMessagesHeading: "Shared Memories",
    memoryTimeJustNow: "Just now",
    memoryTimeMinutes: "minutes ago",
    memoryTimeHours: "hours ago",
    memoryTimeDays: "days ago",
    memoryTimeWeeks: "weeks ago",
    rsvpAttending: "I'll Attend",
    rsvpNotAttending: "I Can't Attend",
    rsvpNamePlaceholder: "Enter your name",
    rsvpPhonePlaceholder: "Phone number (optional)",
    rsvpAttendanceLabel: "Attendance",
    rsvpAdditionalGuests: "Additional Guests",
    rsvpAddGuest: "Add Guest",
    rsvpGuestPlaceholder: "Guest name",
    rsvpNotePlaceholder: "Any notes? (optional)",
    rsvpSubmit: "Submit",
    rsvpSubmitting: "Submitting...",
    rsvpSuccessTitle: "Thank You!",
    rsvpSuccessMessage: "Your RSVP has been recorded. We look forward to seeing you.",
    rsvpNameRequired: "Please enter your name.",
    rsvpSuccessToast: "Your RSVP has been saved!",
    rsvpErrorToast: "Something went wrong. Please try again.",
    galleryUploadHeading: "Upload Photo",
    galleryUploadNamePlaceholder: "Your Full Name",
    galleryUploading: "uploading...",
    galleryUploadSuccess: "photo uploaded successfully!",
    galleryUploadError: "photo upload failed.",
    galleryEmpty: "No photos yet",
    galleryEmptySubtitle: "Be the first to upload a photo!",
    galleryUploadInfo: "Up to 25 photos at once · Max 10MB each",
    eventLabel: "Event Details",
    eventScheduleHeading: "Event Schedule",
    eventFamilyHeading: "Families",
    eventBrideFamily: "Bride's Family",
    eventGroomFamily: "Groom's Family",
    eventDressCode: "Formal",
    contactLabel: "Contact",
    contactText: "Feel free to reach out to us with any questions about our wedding.",
    contactCtaButton: "RSVP Now",
    footerCreatedWith: "created with",
    footerCtaHeading: "Would you like an invitation like this?",
    footerCtaText: "Create your own wedding website in minutes.",
    footerCtaButton: "Get Started",
    footerPrivacy: "Privacy",
    footerRights: "All rights reserved.",
  },
  de: {
    navHome: "Startseite",
    navStory: "Unsere Geschichte",
    navEvent: "Veranstaltung",
    navGallery: "Galerie",
    navMemory: "Gästebuch",
    navRsvp: "RSVP",
    navLogin: "Anmelden",
    bottomMemory: "Erinnerung",
    bottomRsvp: "Teilnahme",
    heroTagline: "Wir heiraten",
    heroCtaButton: "Jetzt antworten",
    heroScrollHint: "Entdecken",
    countdownLabel: "Countdown",
    countdownHeading: "Der große Tag naht",
    countdownDays: "Tage",
    countdownHours: "Stunden",
    countdownMinutes: "Minuten",
    countdownSeconds: "Sekunden",
    storyLabel: "Unsere Geschichte",
    storyText: "Wir haben beschlossen, unser Leben zu vereinen. Wir möchten diese Reise mit Ihnen teilen.",
    storyCtaButton: "Unsere Geschichte lesen",
    venueLabel: "Ort & Veranstaltung",
    venueAddress: "Adresse",
    venueDate: "Datum",
    venueTime: "Uhrzeit",
    venueCtaButton: "Details ansehen",
    galleryLabel: "Galerie",
    galleryHeading: "Unsere Erinnerungen",
    galleryCtaButton: "Gesamte Galerie",
    ctaHeading: "Wir warten auf Sie",
    ctaText: "Wir würden uns freuen, Sie am schönsten Tag unseres Lebens bei uns zu haben.",
    ctaButton: "Jetzt antworten",
    memoryPageLabel: "Gästebuch",
    memoryPageHeading: "Gästebuch",
    memoryPageSubtitle: "Teilen Sie Ihre Erinnerungen und Wünsche mit uns.",
    memoryApprovalNotice: "Ihre Nachricht wird nach Genehmigung durch das Brautpaar hier angezeigt.",
    memoryFormHeading: "Eine Erinnerung hinterlassen",
    memoryNamePlaceholder: "Ihr vollständiger Name",
    memoryMessagePlaceholder: "Schreiben Sie Ihre Wünsche...",
    memorySubmitButton: "Senden",
    memorySubmitting: "Wird gesendet...",
    memorySuccessToast: "Ihre Nachricht wurde gespeichert!",
    memoryErrorToast: "Ein Fehler ist aufgetreten.",
    memoryNameRequired: "Bitte geben Sie Ihren Namen ein.",
    memoryMessageRequired: "Bitte geben Sie eine Nachricht ein.",
    memoryPendingBadge: "Genehmigung ausstehend",
    memoryEmptyTitle: "Noch keine Erinnerungen",
    memoryEmptySubtitle: "Seien Sie der Erste!",
    memoryMessagesHeading: "Geteilte Erinnerungen",
    memoryTimeJustNow: "Gerade eben",
    memoryTimeMinutes: "Minuten her",
    memoryTimeHours: "Stunden her",
    memoryTimeDays: "Tage her",
    memoryTimeWeeks: "Wochen her",
    rsvpAttending: "Ich nehme teil",
    rsvpNotAttending: "Ich kann nicht",
    rsvpNamePlaceholder: "Name eingeben",
    rsvpPhonePlaceholder: "Telefonnummer (optional)",
    rsvpAttendanceLabel: "Teilnahme",
    rsvpAdditionalGuests: "Weitere Gäste",
    rsvpAddGuest: "Gast hinzufügen",
    rsvpGuestPlaceholder: "Name des Gastes",
    rsvpNotePlaceholder: "Haben Sie eine Notiz? (optional)",
    rsvpSubmit: "Absenden",
    rsvpSubmitting: "Wird gesendet...",
    rsvpSuccessTitle: "Vielen Dank!",
    rsvpSuccessMessage: "Ihre RSVP wurde gespeichert.",
    rsvpNameRequired: "Bitte geben Sie Ihren Namen ein.",
    rsvpSuccessToast: "Ihre RSVP wurde gespeichert!",
    rsvpErrorToast: "Ein Fehler ist aufgetreten.",
    galleryUploadHeading: "Foto hochladen",
    galleryUploadNamePlaceholder: "Ihr Name",
    galleryUploading: "wird hochgeladen...",
    galleryUploadSuccess: "Foto hochgeladen!",
    galleryUploadError: "Hochladen fehlgeschlagen.",
    galleryEmpty: "Noch keine Fotos",
    galleryEmptySubtitle: "Seien Sie der Erste!",
    galleryUploadInfo: "Bis zu 25 Fotos · Max. 10MB",
    eventLabel: "Veranstaltungsdetails",
    eventScheduleHeading: "Programm",
    eventFamilyHeading: "Familien",
    eventBrideFamily: "Familie der Braut",
    eventGroomFamily: "Familie des Bräutigams",
    eventDressCode: "Formell",
    contactLabel: "Kontakt",
    contactText: "Bei Fragen zu unserer Hochzeit kontaktieren Sie uns gerne.",
    contactCtaButton: "Jetzt antworten",
    footerCreatedWith: "erstellt mit",
    footerCtaHeading: "Möchten Sie auch so eine Einladung?",
    footerCtaText: "Erstellen Sie Ihre Hochzeitswebsite in Minuten.",
    footerCtaButton: "Jetzt starten",
    footerPrivacy: "Datenschutz",
    footerRights: "Alle Rechte vorbehalten.",
  },
};

let currentLocale: CrystalLocale = "tr";

export function setCrystalLocale(locale: CrystalLocale) {
  currentLocale = locale;
}

export function t(key: keyof CrystalTranslations): string {
  return translations[currentLocale][key] || translations.tr[key] || key;
}

export function getTranslations(locale: CrystalLocale): CrystalTranslations {
  return translations[locale] || translations.tr;
}
