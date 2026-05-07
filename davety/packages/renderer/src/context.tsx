"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface RendererContextValue {
  /** Absolute URL pointing at the davety app (e.g. https://design.uygundavet.com). */
  publicBase?: string;
  /** Public slug for the currently-rendered invitation. Required for memory/RSVP endpoints. */
  slug?: string;
  /** Wedding start time as ISO 8601 (used for calendar deep-links). */
  startIso?: string;
  /** Public share URL of the invitation, embedded in calendar invites. */
  publicUrl?: string;
  /** Personalised guest token, when the visitor came in via /davetiyem/[slug]/[token]. */
  guestToken?: string;
}

const Ctx = createContext<RendererContextValue>({});

export function RendererProvider({
  value,
  children,
}: {
  value: RendererContextValue;
  children: ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRendererContext() {
  return useContext(Ctx);
}

export function apiUrl(path: string, base?: string): string {
  if (!base) return path;
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
