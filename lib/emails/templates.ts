type Locale = "tr" | "en" | "de";

const translations = {
  verification: {
    tr: {
      subject: "E-posta Adresinizi Doğrulayın - Uygun Davet",
      heading: "E-posta Doğrulama",
      body: "Hesabınızı doğrulamak için aşağıdaki butona tıklayın.",
      button: "E-postamı Doğrula",
      expire: "Bu bağlantı 24 saat içinde geçerliliğini yitirecektir.",
      ignore: "Bu e-postayı siz talep etmediyseniz, güvenle görmezden gelebilirsiniz.",
    },
    en: {
      subject: "Verify Your Email - Uygun Davet",
      heading: "Email Verification",
      body: "Click the button below to verify your account.",
      button: "Verify My Email",
      expire: "This link will expire in 24 hours.",
      ignore: "If you didn't request this email, you can safely ignore it.",
    },
    de: {
      subject: "Bestätigen Sie Ihre E-Mail - Uygun Davet",
      heading: "E-Mail-Bestätigung",
      body: "Klicken Sie auf die Schaltfläche unten, um Ihr Konto zu bestätigen.",
      button: "E-Mail bestätigen",
      expire: "Dieser Link läuft in 24 Stunden ab.",
      ignore: "Wenn Sie diese E-Mail nicht angefordert haben, können Sie sie ignorieren.",
    },
  },
  resetPassword: {
    tr: {
      subject: "Şifre Sıfırlama - Uygun Davet",
      heading: "Şifre Sıfırlama",
      body: "Şifrenizi sıfırlamak için aşağıdaki butona tıklayın.",
      button: "Şifremi Sıfırla",
      expire: "Bu bağlantı 1 saat içinde geçerliliğini yitirecektir.",
      ignore: "Bu e-postayı siz talep etmediyseniz, şifreniz değişmeyecektir.",
    },
    en: {
      subject: "Reset Your Password - Uygun Davet",
      heading: "Password Reset",
      body: "Click the button below to reset your password.",
      button: "Reset My Password",
      expire: "This link will expire in 1 hour.",
      ignore: "If you didn't request this, your password will remain unchanged.",
    },
    de: {
      subject: "Passwort zurücksetzen - Uygun Davet",
      heading: "Passwort zurücksetzen",
      body: "Klicken Sie auf die Schaltfläche unten, um Ihr Passwort zurückzusetzen.",
      button: "Passwort zurücksetzen",
      expire: "Dieser Link läuft in 1 Stunde ab.",
      ignore: "Wenn Sie dies nicht angefordert haben, bleibt Ihr Passwort unverändert.",
    },
  },
  welcome: {
    tr: {
      subject: "Hoş Geldiniz! - Uygun Davet",
      heading: "Uygun Davet'e Hoş Geldiniz!",
      body: "Hesabınız başarıyla oluşturuldu. Artık düğün davetiyeleri oluşturabilir, misafir listenizi yönetebilir ve çok daha fazlasını yapabilirsiniz.",
      button: "Panelime Git",
      tip: "Herhangi bir sorunuz olursa davet@uygundavet.com adresinden bize ulaşabilirsiniz.",
    },
    en: {
      subject: "Welcome! - Uygun Davet",
      heading: "Welcome to Uygun Davet!",
      body: "Your account has been created successfully. You can now create wedding invitations, manage your guest list, and much more.",
      button: "Go to Dashboard",
      tip: "If you have any questions, reach us at davet@uygundavet.com.",
    },
    de: {
      subject: "Willkommen! - Uygun Davet",
      heading: "Willkommen bei Uygun Davet!",
      body: "Ihr Konto wurde erfolgreich erstellt. Sie können jetzt Hochzeitseinladungen erstellen, Ihre Gästeliste verwalten und vieles mehr.",
      button: "Zum Dashboard",
      tip: "Bei Fragen erreichen Sie uns unter davet@uygundavet.com.",
    },
  },
  orderConfirmation: {
    tr: {
      subject: "Kaydınız Alındı - Uygun Davet",
      heading: "Kaydınız Başarıyla Oluşturuldu!",
      body: "Düğün davetiyeniz için kayıt bilgileriniz aşağıda özetlenmiştir.",
      packageLabel: "Seçilen Paket",
      themeLabel: "Seçilen Tema",
      paymentLabel: "Ödeme Yöntemi",
      totalLabel: "Toplam Tutar",
      depositLabel: "Kapora Tutarı",
      coupleLabel: "Çift Bilgileri",
      familyLabel: "Aile Bilgileri",
      dateLabel: "Düğün Tarihi",
      deposit: "Kapora + Teslimatta Kalan",
      full: "Peşin Ödeme",
      footer: "Ödeme bilgileri için panelinize giriş yapabilirsiniz.",
      button: "Panelime Git",
    },
    en: {
      subject: "Registration Received - Uygun Davet",
      heading: "Your Registration is Complete!",
      body: "Here is a summary of your wedding invitation registration details.",
      packageLabel: "Selected Package",
      themeLabel: "Selected Theme",
      paymentLabel: "Payment Method",
      totalLabel: "Total Amount",
      depositLabel: "Deposit Amount",
      coupleLabel: "Couple Information",
      familyLabel: "Family Information",
      dateLabel: "Wedding Date",
      deposit: "Deposit + Remaining on Delivery",
      full: "Full Payment",
      footer: "You can sign in to your dashboard for payment details.",
      button: "Go to Dashboard",
    },
    de: {
      subject: "Registrierung erhalten - Uygun Davet",
      heading: "Ihre Registrierung ist abgeschlossen!",
      body: "Hier ist eine Zusammenfassung Ihrer Hochzeitseinladungs-Registrierung.",
      packageLabel: "Gewähltes Paket",
      themeLabel: "Gewähltes Thema",
      paymentLabel: "Zahlungsmethode",
      totalLabel: "Gesamtbetrag",
      depositLabel: "Anzahlung",
      coupleLabel: "Paarinformationen",
      familyLabel: "Familieninformationen",
      dateLabel: "Hochzeitsdatum",
      deposit: "Anzahlung + Rest bei Lieferung",
      full: "Vollständige Zahlung",
      footer: "Melden Sie sich in Ihrem Dashboard an, um die Zahlungsdetails zu erhalten.",
      button: "Zum Dashboard",
    },
  },
};

function baseLayout(content: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background-color:#252224;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#252224;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#1c1a1b;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 0;text-align:center;">
              <img src="https://www.uygundavet.com/logo-gold-transparent.png" alt="Uygun Davet" width="48" height="48" style="display:block;margin:0 auto 12px;" />
              <img src="https://www.uygundavet.com/email-brand.png" alt="Uygun Davet" width="180" height="76" style="display:block;margin:0 auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#ffffff40;">
                &copy; ${new Date().getFullYear()} Uygun Davet. uygundavet.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function actionEmail(t: { heading: string; body: string; button: string; expire: string; ignore: string }, url: string) {
  return baseLayout(`
    <h1 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#f5f6f3;">${t.heading}</h1>
    <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#f5f6f380;">${t.body}</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${url}" style="display:inline-block;padding:14px 32px;background-color:#f5f6f3;color:#252224;font-size:14px;font-weight:600;text-decoration:none;border-radius:12px;letter-spacing:0.5px;">${t.button}</a>
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0;font-size:13px;color:#f5f6f350;">${t.expire}</p>
    <p style="margin:8px 0 0;font-size:12px;color:#f5f6f330;">${t.ignore}</p>
  `);
}

export function verificationEmail(url: string, locale: Locale = "tr") {
  const t = translations.verification[locale] || translations.verification.tr;
  return { subject: t.subject, html: actionEmail(t, url) };
}

export function resetPasswordEmail(url: string, locale: Locale = "tr") {
  const t = translations.resetPassword[locale] || translations.resetPassword.tr;
  return { subject: t.subject, html: actionEmail(t, url) };
}

export function welcomeEmail(dashboardUrl: string, locale: Locale = "tr") {
  const t = translations.welcome[locale] || translations.welcome.tr;
  const tip = "tip" in t ? t.tip : "";
  return {
    subject: t.subject,
    html: baseLayout(`
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:600;color:#f5f6f3;">${t.heading}</h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#f5f6f380;">${t.body}</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <a href="${dashboardUrl}" style="display:inline-block;padding:14px 32px;background-color:#f5f6f3;color:#252224;font-size:14px;font-weight:600;text-decoration:none;border-radius:12px;letter-spacing:0.5px;">${t.button}</a>
          </td>
        </tr>
      </table>
      <p style="margin:24px 0 0;font-size:13px;color:#f5f6f350;">${tip}</p>
    `),
  };
}

interface OrderEmailData {
  selectedPackage: string;
  selectedTheme: string;
  customThemeRequest?: string;
  paymentMethod: "deposit" | "full";
  totalAmount: number;
  depositAmount: number;
  groomName: string;
  brideName: string;
  groomFamily?: { fatherName: string; motherName: string };
  brideFamily?: { fatherName: string; motherName: string };
  weddingDate: string;
  dashboardUrl: string;
}

function infoRow(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 0;font-size:13px;color:#f5f6f360;font-family:sans-serif;">${label}</td>
    <td style="padding:6px 0;font-size:13px;color:#f5f6f3;font-family:sans-serif;text-align:right;font-weight:600;">${value}</td>
  </tr>`;
}

export function orderConfirmationEmail(data: OrderEmailData, locale: Locale = "tr") {
  const t = translations.orderConfirmation[locale] || translations.orderConfirmation.tr;
  const paymentMethodText = data.paymentMethod === "deposit" ? t.deposit : t.full;
  const themeText = data.selectedTheme === "custom"
    ? `Custom: ${data.customThemeRequest || ""}`
    : data.selectedTheme.charAt(0).toUpperCase() + data.selectedTheme.slice(1);

  return {
    subject: t.subject,
    html: baseLayout(`
      <h1 style="margin:0 0 12px;font-size:24px;font-weight:600;color:#f5f6f3;">${t.heading}</h1>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#f5f6f370;">${t.body}</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff08;border-radius:12px;padding:4px 16px;margin-bottom:16px;">
        ${infoRow(t.packageLabel, data.selectedPackage.toUpperCase())}
        ${infoRow(t.themeLabel, themeText)}
        ${infoRow(t.paymentLabel, paymentMethodText)}
        ${infoRow(t.totalLabel, data.totalAmount.toLocaleString("tr-TR") + "₺")}
        ${data.paymentMethod === "deposit" ? infoRow(t.depositLabel, data.depositAmount.toLocaleString("tr-TR") + "₺") : ""}
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff08;border-radius:12px;padding:4px 16px;margin-bottom:16px;">
        ${infoRow(t.coupleLabel, "")}
        ${infoRow("👤", data.groomName)}
        ${infoRow("👤", data.brideName)}
        ${infoRow(t.dateLabel, data.weddingDate)}
      </table>

      ${data.groomFamily || data.brideFamily ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff08;border-radius:12px;padding:4px 16px;margin-bottom:24px;">
        ${data.groomFamily ? `${infoRow(t.familyLabel + " (1)", "")}
        ${infoRow("Baba", data.groomFamily.fatherName)}
        ${infoRow("Anne", data.groomFamily.motherName)}` : ""}
        ${data.brideFamily ? `${infoRow(t.familyLabel + " (2)", "")}
        ${infoRow("Baba", data.brideFamily.fatherName)}
        ${infoRow("Anne", data.brideFamily.motherName)}` : ""}
      </table>` : ""}

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <a href="${data.dashboardUrl}" style="display:inline-block;padding:14px 32px;background-color:#f5f6f3;color:#252224;font-size:14px;font-weight:600;text-decoration:none;border-radius:12px;letter-spacing:0.5px;">${t.button}</a>
          </td>
        </tr>
      </table>
      <p style="margin:20px 0 0;font-size:13px;color:#f5f6f350;text-align:center;">${t.footer}</p>
    `),
  };
}
