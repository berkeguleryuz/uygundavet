import type { Metadata } from "next";
import { EtkinlikContent } from "./_content";

export const metadata: Metadata = {
  title: "Etkinlik",
};

export default function EtkinlikPage() {
  return <EtkinlikContent />;
}
