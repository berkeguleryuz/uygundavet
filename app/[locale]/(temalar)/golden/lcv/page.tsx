import type { Metadata } from "next";
import { RsvpForm } from "../_components/RsvpForm";

export const metadata: Metadata = {
  title: "LCV",
};

export default function LcvPage() {
  return (
    <div className="min-h-svh bg-[#d4b896]/30 pt-28 pb-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-lg mx-auto relative">
        <RsvpForm />
      </div>
    </div>
  );
}
