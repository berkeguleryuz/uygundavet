import type { Metadata } from "next";
import { IletisimContent } from "./_content";

export const metadata: Metadata = {
  title: "İletişim",
};

export default function IletisimPage() {
  return <IletisimContent />;
}
