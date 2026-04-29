import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { prisma } from "./prisma";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const from = process.env.RESEND_FROM ?? "davety <no-reply@davety.app>";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async sendResetPassword({ user, url }) {
      if (!resend) return;
      await resend.emails.send({
        from,
        to: user.email,
        subject: "davety — Şifre Sıfırlama",
        html: `<p>Şifreni sıfırlamak için: <a href="${url}">${url}</a></p>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      if (!resend) return;
      await resend.emails.send({
        from,
        to: user.email,
        subject: "davety — E-posta Doğrulama",
        html: `<p>E-postanı doğrulamak için: <a href="${url}">${url}</a></p>`,
      });
    },
  },
  socialProviders: process.env.GOOGLE_CLIENT_ID
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
