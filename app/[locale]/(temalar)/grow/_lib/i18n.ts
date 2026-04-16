export type GrowLocale = "tr" | "en" | "de";

interface GrowTranslations {
  // Nav
  navHome: string;
  navStory: string;
  navEvent: string;
  navGallery: string;
  navMemory: string;
  navRsvp: string;
  navLogin: string;

  // Hero
  heroTagline: string;
  heroCtaButton: string;
  heroScrollHint: string;

  // Countdown
  countdownLabel: string;
  countdownHeading: string;
  countdownDays: string;
  countdownHours: string;
  countdownMinutes: string;
  countdownSeconds: string;

  // Story preview
  storyLabel: string;
  storyText1: string;
  storyText2: string;
  storyCtaButton: string;

  // Venue preview
  venueLabel: string;
  venueAddress: string;
  venueDate: string;
  venueTime: string;
  venueCtaButton: string;

  // Gallery preview
  galleryLabel: string;
  galleryHeading: string;
  galleryCtaButton: string;

  // CTA
  ctaHeading: string;
  ctaText: string;
  ctaButton: string;
  ctaMemoryLink: string;
  ctaGalleryLink: string;
  ctaContactLink: string;

  // Memory / Anı Defteri
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

  // RSVP
  rsvpAttending: string;
  rsvpNotAttending: string;
  rsvpNamePlaceholder: string;
  rsvpPhonePlaceholder: string;
  rsvpAttendanceLabel: string;
  rsvpAdditionalGuests: string;
  rsvpAddGuest: string;
  rsvpGuestPlaceholder: string;
  rsvpNoteLabel: string;
  rsvpNotePlaceholder: string;
  rsvpSubmit: string;
  rsvpSubmitting: string;
  rsvpSuccessTitle: string;
  rsvpSuccessMessage: string;
  rsvpNameRequired: string;
  rsvpSuccessToast: string;
  rsvpErrorToast: string;

  // Gallery page
  galleryPageLabel: string;
  galleryPageHeading: string;
  galleryUploadHeading: string;
  galleryUploadNamePlaceholder: string;
  galleryUploadButton: string;
  galleryUploading: string;
  galleryUploadSuccess: string;
  galleryUploadError: string;
  galleryEmpty: string;
  galleryEmptySubtitle: string;

  // Event page
  eventLabel: string;
  eventSubtitle: string;
  eventScheduleHeading: string;
  eventFamilyHeading: string;
  eventBrideFamily: string;
  eventGroomFamily: string;
  eventDressCode: string;
  eventMapPlaceholder: string;

  // Contact
  contactLabel: string;
  contactText: string;
  contactCtaButton: string;

  // Footer
  footerCreatedWith: string;
  footerCtaHeading: string;
  footerCtaText: string;
  footerCtaButton: string;
  footerPrivacy: string;
  footerRights: string;

  // Story page (hikayemiz)
  storyPageLabel: string;
  storyFallbackMilestone1Date: string;
  storyFallbackMilestone1Title: string;
  storyFallbackMilestone1Desc: string;
  storyFallbackMilestone2Date: string;
  storyFallbackMilestone2Title: string;
  storyFallbackMilestone2Desc: string;
  storyFallbackMilestone3Date: string;
  storyFallbackMilestone3Title: string;
  storyFallbackMilestone3Desc: string;
  storyFallbackMilestone4Date: string;
  storyFallbackMilestone4Title: string;
  storyFallbackMilestone4Desc: string;
  storyFallbackMilestone5Date: string;
  storyFallbackMilestone5Title: string;
  storyFallbackMilestone5Desc: string;
}

const translations: Record<GrowLocale, GrowTranslations> = {
  tr: {
    navHome: "Ana Sayfa",
    navStory: "Hikayemiz",
    navEvent: "Etkinlik",
    navGallery: "Galeri",
    navMemory: "Anı Defteri",
    navRsvp: "LCV",
    navLogin: "Giriş Yap",

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
    storyText1: "Hayatlarımızı birleştirmeye karar verdik. Tanıştığımız ilk günden bu yana birlikte geçirdiğimiz her an, bizi bugünlere taşıdı.",
    storyText2: "Bu yolculuğun hikâyesini sizinle paylaşmak istiyoruz.",
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
    ctaMemoryLink: "Anı Bırak",
    ctaGalleryLink: "Galeri",
    ctaContactLink: "İletişim",

    memoryPageLabel: "Anı Defteri",
    memoryPageHeading: "Anı Defteri",
    memoryPageSubtitle: "Bizimle güzel anılarınızı ve dileklerinizi paylaşın. Her mesaj bizim için çok değerli.",
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
    rsvpNoteLabel: "Not",
    rsvpNotePlaceholder: "Bir notunuz var mı? (isteğe bağlı)",
    rsvpSubmit: "Gönder",
    rsvpSubmitting: "Gönderiliyor...",
    rsvpSuccessTitle: "Teşekkür Ederiz!",
    rsvpSuccessMessage: "LCV'niz kaydedildi. Sizi aramızda görmekten mutluluk duyacağız.",
    rsvpNameRequired: "Lütfen adınızı girin.",
    rsvpSuccessToast: "LCV'niz başarıyla kaydedildi!",
    rsvpErrorToast: "Bir hata oluştu. Tekrar deneyin.",

    galleryPageLabel: "Galeri",
    galleryPageHeading: "Fotoğraf Galerisi",
    galleryUploadHeading: "Fotoğraf Yükle",
    galleryUploadNamePlaceholder: "Adınızı girin",
    galleryUploadButton: "Fotoğraf seçmek için tıklayın",
    galleryUploading: "Yükleniyor...",
    galleryUploadSuccess: "Fotoğraf başarıyla yüklendi!",
    galleryUploadError: "Yükleme sırasında hata oluştu.",
    galleryEmpty: "Henüz fotoğraf yüklenmedi",
    galleryEmptySubtitle: "İlk fotoğrafı yükleyen siz olun!",

    eventLabel: "Etkinlik Bilgileri",
    eventSubtitle: "Sizi de aramızda görmekten mutluluk duyarız",
    eventScheduleHeading: "Etkinlik Programı",
    eventFamilyHeading: "Aileler",
    eventBrideFamily: "Gelin Ailesi",
    eventGroomFamily: "Damat Ailesi",
    eventDressCode: "Resmi / Formal",
    eventMapPlaceholder: "Harita görünümü",

    contactLabel: "İletişim",
    contactText: "Düğünümüzle ilgili sorularınız için bizimle iletişime geçebilirsiniz. Sizi aramızda görmekten mutluluk duyacağız.",
    contactCtaButton: "LCV'nizi Doldurun",

    footerCreatedWith: "ile oluşturuldu",
    footerCtaHeading: "Siz de böyle bir davetiye ister misiniz?",
    footerCtaText: "Kendi düğün web sitenizi dakikalar içinde oluşturun. QR kodlu davetiye, LCV takibi, fotoğraf galerisi ve çok daha fazlası.",
    footerCtaButton: "Hemen Başla",
    footerPrivacy: "Gizlilik",
    footerRights: "Tüm hakları saklıdır.",

    storyPageLabel: "Hikayemiz",
    storyFallbackMilestone1Date: "İlk Karşılaşma",
    storyFallbackMilestone1Title: "Her Şey Böyle Başladı",
    storyFallbackMilestone1Desc: "İlk kez karşılaştıklarında, hayatlarının değişeceğini bilmiyorlardı. O an basit bir selamlaşma ile başlayan hikâye, bugünlere uzandı.",
    storyFallbackMilestone2Date: "İlk Buluşma",
    storyFallbackMilestone2Title: "Tanışma",
    storyFallbackMilestone2Desc: "Saatlerce süren sohbetler, paylaşılan kahkahalar... Birbirlerini keşfetmeye başladılar.",
    storyFallbackMilestone3Date: "Birlikte",
    storyFallbackMilestone3Title: "Aşk Büyüdü",
    storyFallbackMilestone3Desc: "Her geçen gün birbirlerini daha iyi tanıdılar, birlikte yeni anıların kapısını aralayarak hayatlarını birleştirdiler.",
    storyFallbackMilestone4Date: "Evlilik Teklifi",
    storyFallbackMilestone4Title: "Evet!",
    storyFallbackMilestone4Desc: "Diz çöktü ve hayatının sorusunu sordu. Cevap tabii ki \"Evet!\" oldu.",
    storyFallbackMilestone5Date: "Düğün Günü",
    storyFallbackMilestone5Title: "Yeni Bir Başlangıç",
    storyFallbackMilestone5Desc: "Ve şimdi bu mutlu günü sizlerle paylaşmanın heyecanını yaşıyoruz. Sizi de aramızda görmekten mutluluk duyacağız!",
  },

  en: {
    navHome: "Home",
    navStory: "Our Story",
    navEvent: "Event",
    navGallery: "Gallery",
    navMemory: "Guestbook",
    navRsvp: "RSVP",
    navLogin: "Sign In",

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
    storyText1: "We decided to spend our lives together. Every moment since the day we met has led us to today.",
    storyText2: "We want to share this journey's story with you.",
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
    ctaMemoryLink: "Leave a Memory",
    ctaGalleryLink: "Gallery",
    ctaContactLink: "Contact",

    memoryPageLabel: "Guestbook",
    memoryPageHeading: "Guestbook",
    memoryPageSubtitle: "Share your beautiful memories and wishes with us. Every message is very precious to us.",
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
    rsvpNoteLabel: "Note",
    rsvpNotePlaceholder: "Any notes? (optional)",
    rsvpSubmit: "Submit",
    rsvpSubmitting: "Submitting...",
    rsvpSuccessTitle: "Thank You!",
    rsvpSuccessMessage: "Your RSVP has been recorded. We look forward to seeing you.",
    rsvpNameRequired: "Please enter your name.",
    rsvpSuccessToast: "Your RSVP has been saved!",
    rsvpErrorToast: "Something went wrong. Please try again.",

    galleryPageLabel: "Gallery",
    galleryPageHeading: "Photo Gallery",
    galleryUploadHeading: "Upload Photo",
    galleryUploadNamePlaceholder: "Enter your name",
    galleryUploadButton: "Click to select a photo",
    galleryUploading: "Uploading...",
    galleryUploadSuccess: "Photo uploaded successfully!",
    galleryUploadError: "Upload failed.",
    galleryEmpty: "No photos yet",
    galleryEmptySubtitle: "Be the first to upload a photo!",

    eventLabel: "Event Details",
    eventSubtitle: "We would be delighted to have you with us",
    eventScheduleHeading: "Event Schedule",
    eventFamilyHeading: "Families",
    eventBrideFamily: "Bride's Family",
    eventGroomFamily: "Groom's Family",
    eventDressCode: "Formal",
    eventMapPlaceholder: "Map view",

    contactLabel: "Contact",
    contactText: "Feel free to reach out to us with any questions about our wedding. We look forward to seeing you.",
    contactCtaButton: "RSVP Now",

    footerCreatedWith: "created with",
    footerCtaHeading: "Would you like an invitation like this?",
    footerCtaText: "Create your own wedding website in minutes. QR invitations, RSVP tracking, photo gallery and much more.",
    footerCtaButton: "Get Started",
    footerPrivacy: "Privacy",
    footerRights: "All rights reserved.",

    storyPageLabel: "Our Story",
    storyFallbackMilestone1Date: "First Meeting",
    storyFallbackMilestone1Title: "How It All Began",
    storyFallbackMilestone1Desc: "When they first met, they had no idea their lives were about to change. A simple greeting turned into a story that continues to this day.",
    storyFallbackMilestone2Date: "First Date",
    storyFallbackMilestone2Title: "Getting to Know",
    storyFallbackMilestone2Desc: "Hours of conversation, shared laughter... They started discovering each other.",
    storyFallbackMilestone3Date: "Together",
    storyFallbackMilestone3Title: "Love Grew",
    storyFallbackMilestone3Desc: "Each day they knew each other better, opening the door to new memories and bringing their lives together.",
    storyFallbackMilestone4Date: "The Proposal",
    storyFallbackMilestone4Title: "Yes!",
    storyFallbackMilestone4Desc: "He got down on one knee and asked the question of a lifetime. The answer was of course \"Yes!\"",
    storyFallbackMilestone5Date: "Wedding Day",
    storyFallbackMilestone5Title: "A New Beginning",
    storyFallbackMilestone5Desc: "And now we are thrilled to share this happy day with you. We look forward to seeing you there!",
  },

  de: {
    navHome: "Startseite",
    navStory: "Unsere Geschichte",
    navEvent: "Veranstaltung",
    navGallery: "Galerie",
    navMemory: "Gästebuch",
    navRsvp: "RSVP",
    navLogin: "Anmelden",

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
    storyText1: "Wir haben beschlossen, unser Leben zu vereinen. Jeder Moment seit dem Tag, an dem wir uns kennengelernt haben, hat uns bis hierhin geführt.",
    storyText2: "Wir möchten die Geschichte dieser Reise mit Ihnen teilen.",
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
    ctaMemoryLink: "Erinnerung",
    ctaGalleryLink: "Galerie",
    ctaContactLink: "Kontakt",

    memoryPageLabel: "Gästebuch",
    memoryPageHeading: "Gästebuch",
    memoryPageSubtitle: "Teilen Sie Ihre schönen Erinnerungen und Wünsche mit uns. Jede Nachricht ist uns sehr wertvoll.",
    memoryApprovalNotice: "Ihre Nachricht wird hier angezeigt, nachdem sie vom Brautpaar genehmigt wurde.",
    memoryFormHeading: "Eine Erinnerung hinterlassen",
    memoryNamePlaceholder: "Ihr vollständiger Name",
    memoryMessagePlaceholder: "Schreiben Sie Ihre Wünsche für das Brautpaar...",
    memorySubmitButton: "Senden",
    memorySubmitting: "Wird gesendet...",
    memorySuccessToast: "Ihre Nachricht wurde gespeichert!",
    memoryErrorToast: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
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
    rsvpNotAttending: "Ich kann nicht teilnehmen",
    rsvpNamePlaceholder: "Name eingeben",
    rsvpPhonePlaceholder: "Telefonnummer (optional)",
    rsvpAttendanceLabel: "Teilnahme",
    rsvpAdditionalGuests: "Weitere Gäste",
    rsvpAddGuest: "Gast hinzufügen",
    rsvpGuestPlaceholder: "Name des Gastes",
    rsvpNoteLabel: "Notiz",
    rsvpNotePlaceholder: "Haben Sie eine Notiz? (optional)",
    rsvpSubmit: "Absenden",
    rsvpSubmitting: "Wird gesendet...",
    rsvpSuccessTitle: "Vielen Dank!",
    rsvpSuccessMessage: "Ihre RSVP wurde gespeichert. Wir freuen uns auf Sie.",
    rsvpNameRequired: "Bitte geben Sie Ihren Namen ein.",
    rsvpSuccessToast: "Ihre RSVP wurde gespeichert!",
    rsvpErrorToast: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",

    galleryPageLabel: "Galerie",
    galleryPageHeading: "Fotogalerie",
    galleryUploadHeading: "Foto hochladen",
    galleryUploadNamePlaceholder: "Name eingeben",
    galleryUploadButton: "Klicken Sie, um ein Foto auszuwählen",
    galleryUploading: "Wird hochgeladen...",
    galleryUploadSuccess: "Foto erfolgreich hochgeladen!",
    galleryUploadError: "Hochladen fehlgeschlagen.",
    galleryEmpty: "Noch keine Fotos",
    galleryEmptySubtitle: "Seien Sie der Erste!",

    eventLabel: "Veranstaltungsdetails",
    eventSubtitle: "Wir würden uns freuen, Sie bei uns zu haben",
    eventScheduleHeading: "Programm",
    eventFamilyHeading: "Familien",
    eventBrideFamily: "Familie der Braut",
    eventGroomFamily: "Familie des Bräutigams",
    eventDressCode: "Formell",
    eventMapPlaceholder: "Kartenansicht",

    contactLabel: "Kontakt",
    contactText: "Bei Fragen zu unserer Hochzeit können Sie uns gerne kontaktieren. Wir freuen uns auf Sie.",
    contactCtaButton: "Jetzt antworten",

    footerCreatedWith: "erstellt mit",
    footerCtaHeading: "Möchten Sie auch so eine Einladung?",
    footerCtaText: "Erstellen Sie Ihre eigene Hochzeitswebsite in Minuten. QR-Einladungen, RSVP-Tracking, Fotogalerie und vieles mehr.",
    footerCtaButton: "Jetzt starten",
    footerPrivacy: "Datenschutz",
    footerRights: "Alle Rechte vorbehalten.",

    storyPageLabel: "Unsere Geschichte",
    storyFallbackMilestone1Date: "Erstes Treffen",
    storyFallbackMilestone1Title: "Wie alles begann",
    storyFallbackMilestone1Desc: "Als sie sich zum ersten Mal trafen, ahnten sie nicht, dass sich ihr Leben verändern würde.",
    storyFallbackMilestone2Date: "Erstes Date",
    storyFallbackMilestone2Title: "Kennenlernen",
    storyFallbackMilestone2Desc: "Stundenlange Gespräche, geteiltes Lachen... Sie begannen, einander zu entdecken.",
    storyFallbackMilestone3Date: "Zusammen",
    storyFallbackMilestone3Title: "Die Liebe wuchs",
    storyFallbackMilestone3Desc: "Jeden Tag lernten sie sich besser kennen und brachten ihre Leben zusammen.",
    storyFallbackMilestone4Date: "Der Antrag",
    storyFallbackMilestone4Title: "Ja!",
    storyFallbackMilestone4Desc: "Er kniete nieder und stellte die Frage seines Lebens. Die Antwort war natürlich \"Ja!\"",
    storyFallbackMilestone5Date: "Hochzeitstag",
    storyFallbackMilestone5Title: "Ein neuer Anfang",
    storyFallbackMilestone5Desc: "Und jetzt freuen wir uns, diesen glücklichen Tag mit Ihnen zu teilen!",
  },
};

// Default to Turkish for now — will be dynamic based on customer preference
let currentLocale: GrowLocale = "tr";

export function setGrowLocale(locale: GrowLocale) {
  currentLocale = locale;
}

export function t(key: keyof GrowTranslations): string {
  return translations[currentLocale][key] || translations.tr[key] || key;
}

export function getTranslations(locale: GrowLocale): GrowTranslations {
  return translations[locale] || translations.tr;
}
