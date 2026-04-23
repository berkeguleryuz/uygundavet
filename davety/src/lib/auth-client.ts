import { createAuthClient } from "better-auth/react";

// Better Auth client: when same-origin, baseURL can be omitted and the client
// will use window.location. Pass NEXT_PUBLIC_DAVETY_URL for cross-origin setups.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_DAVETY_URL,
});

export const { useSession, signIn, signOut, signUp } = authClient;
