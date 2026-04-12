import type { Metadata } from "next";
import { ClodronLayoutClient } from "./ClodronLayoutClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ClodronLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClodronLayoutClient>{children}</ClodronLayoutClient>;
}
