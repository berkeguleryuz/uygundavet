/**
 * Better Auth İngilizce hata mesajlarını / kodlarını Türkçe'ye çeviren
 * helper. Hem `error.code` hem `error.message` üzerinden eşleşir,
 * çünkü Better Auth bazı senaryolarda code yerine sadece message
 * döndürebiliyor.
 */

const CODE_MAP: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "E-posta veya şifre hatalı.",
  INVALID_PASSWORD: "Şifre hatalı.",
  INVALID_EMAIL: "Geçersiz e-posta adresi.",
  USER_NOT_FOUND: "Bu e-posta ile bir hesap bulunamadı.",
  USER_ALREADY_EXISTS: "Bu e-posta ile zaten bir hesap var.",
  EMAIL_NOT_VERIFIED: "E-postanı doğrulaman gerekiyor.",
  PASSWORD_TOO_SHORT: "Şifre çok kısa, en az 8 karakter olmalı.",
  PASSWORD_TOO_LONG: "Şifre çok uzun.",
  ACCOUNT_NOT_FOUND: "Hesap bulunamadı.",
  CREDENTIAL_ACCOUNT_NOT_FOUND:
    "E-posta + şifre ile kayıt yok. Google ile giriş yapmış olabilirsin.",
  SESSION_EXPIRED: "Oturum süren doldu, tekrar giriş yap.",
  TOO_MANY_REQUESTS: "Çok fazla deneme. Birkaç dakika sonra tekrar dene.",
  RATE_LIMIT: "Çok fazla deneme. Birkaç dakika sonra tekrar dene.",
  PROVIDER_ERROR: "Sosyal giriş sağlayıcısında hata oluştu.",
  EMAIL_CAN_NOT_BE_UPDATED: "E-posta güncellenemez.",
  FAILED_TO_CREATE_USER: "Hesap oluşturulamadı, tekrar dene.",
  FAILED_TO_CREATE_SESSION: "Oturum açılamadı, tekrar dene.",
};

const MESSAGE_PATTERNS: Array<[RegExp, string]> = [
  [/invalid email or password/i, "E-posta veya şifre hatalı."],
  [/invalid password/i, "Şifre hatalı."],
  [/invalid email/i, "Geçersiz e-posta adresi."],
  [/user not found/i, "Bu e-posta ile bir hesap bulunamadı."],
  [/user already exists/i, "Bu e-posta ile zaten bir hesap var."],
  [/email already exists/i, "Bu e-posta ile zaten bir hesap var."],
  [/email not verified/i, "E-postanı doğrulaman gerekiyor."],
  [/password.*too short/i, "Şifre çok kısa, en az 8 karakter olmalı."],
  [/password.*too long/i, "Şifre çok uzun."],
  [/too many requests/i, "Çok fazla deneme. Birkaç dakika sonra tekrar dene."],
  [/rate.?limit/i, "Çok fazla deneme. Birkaç dakika sonra tekrar dene."],
  [/credential account not found/i,
    "E-posta + şifre ile kayıt yok. Google ile giriş yapmış olabilirsin."],
  [/session.*expired/i, "Oturum süren doldu, tekrar giriş yap."],
  [/network/i, "Bağlantı hatası. İnternetini kontrol et."],
];

export interface AuthErrorLike {
  code?: string;
  message?: string;
}

export function translateAuthError(
  err: AuthErrorLike | null | undefined,
  fallback = "Bir sorun oluştu, tekrar dene."
): string {
  if (!err) return fallback;
  if (err.code && CODE_MAP[err.code]) return CODE_MAP[err.code];
  if (err.message) {
    for (const [pattern, tr] of MESSAGE_PATTERNS) {
      if (pattern.test(err.message)) return tr;
    }
  }
  return fallback;
}
