import type { Metadata } from "next";
import { DemoLayoutClient } from "./DemoLayoutClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DemoLayoutClient>{children}</DemoLayoutClient>;
}
