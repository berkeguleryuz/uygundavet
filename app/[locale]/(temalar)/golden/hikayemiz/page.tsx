import type { Metadata } from "next";
import { HikayemizContent } from "./_content";

export const metadata: Metadata = {
  title: "Hikayemiz",
};

export default function HikayemizPage() {
  return <HikayemizContent />;
}
