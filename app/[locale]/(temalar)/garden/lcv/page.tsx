import type { Metadata } from "next";
import { RsvpForm } from "../_components/RsvpForm";

export const metadata: Metadata = {
  title: "LCV",
};

export default function LcvPage() {
  return (
    <div className="min-h-svh bg-[#e3e9d6] pt-28 pb-12 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <RsvpForm />
      </div>
    </div>
  );
}
