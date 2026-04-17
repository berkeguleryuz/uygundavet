import type { Metadata } from "next";
import { RsvpForm } from "../_components/RsvpForm";

export const metadata: Metadata = {
  title: "LCV",
};

export default function LcvPage() {
  return (
    <div className="min-h-svh bg-[#d4b896]/30 pt-28 pb-12 px-4 sm:px-6 relative overflow-hidden">
      <div aria-hidden className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,_rgba(244,169,0,0.2)_0%,_rgba(244,169,0,0)_70%)] pointer-events-none" />
      <div className="max-w-lg mx-auto relative">
        <RsvpForm />
      </div>
    </div>
  );
}
