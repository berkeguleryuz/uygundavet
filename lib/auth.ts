import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import { ObjectId } from "mongodb";
import { db } from "./db";
import { resend, FROM_EMAIL } from "./resend";
import {
  verificationEmail,
  resetPasswordEmail,
} from "./emails/templates";

async function getUserLocale(email: string): Promise<"tr" | "en" | "de"> {
  try {
    const user = await db.collection("user").findOne({ email });
    const locale = user?.locale;
    if (locale === "en" || locale === "de") return locale;
  } catch {}
  return "tr";
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "https://uygundavet.com",
    "https://www.uygundavet.com",
  ],
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const locale = await getUserLocale(user.email);
      const { subject, html } = resetPasswordEmail(url, locale);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject,
        html,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const locale = await getUserLocale(user.email);
      const { subject, html } = verificationEmail(url, locale);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email,
        subject,
        html,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 86400,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          try {
            const userId = String(session.userId);
            const filter = ObjectId.isValid(userId)
              ? { $or: [{ _id: new ObjectId(userId) }, { id: userId }] }
              : { id: userId };
            const target = await db.collection("user").findOne(filter);
            if (target?.disabled) {
              throw new APIError("FORBIDDEN", {
                message: "Hesabınız yönetici tarafından deaktif edildi.",
                code: "ACCOUNT_DISABLED",
              });
            }
          } catch (err) {
            if (err instanceof APIError) throw err;
          }
        },
      },
    },
  },
  plugins: [
    admin({
      adminRoles: ["admin"],
      defaultRole: "user",
      impersonationSessionDuration: 60 * 60,
    }),
    nextCookies(),
  ],
});
