"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  AttendingIcon,
  DeclineIcon,
  HeartIcon,
  CameraIcon,
  PenIcon,
  UploadIcon,
  SuccessIcon,
} from "./RsvpIcons";

interface InvitationData {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  hasGallery: boolean;
  hasMemoryBook: boolean;
}

export function RsvpForm({ inviteCode, source }: { inviteCode: string; source?: string }) {
  const t = useTranslations("Rsvp");
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<"confirmed" | "declined" | null>(null);
  const [additionalGuests, setAdditionalGuests] = useState<{ name: string }[]>([]);
  const [note, setNote] = useState("");
  const [memoryMessage, setMemoryMessage] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photosUploaded, setPhotosUploaded] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showMemoryMessage, setShowMemoryMessage] = useState(false);

  useEffect(() => {
    fetch(`/api/public/rsvp/${inviteCode}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => setInvitation(data.invitation))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [inviteCode]);

  const handleAddGuest = () => {
    setAdditionalGuests((prev) => [...prev, { name: "" }]);
  };

  const handleRemoveGuest = (index: number) => {
    setAdditionalGuests((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGuestNameChange = (index: number, value: string) => {
    setAdditionalGuests((prev) =>
      prev.map((g, i) => (i === index ? { name: value } : g))
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !name.trim()) {
      if (!name.trim()) toast.error("Lütfen önce adınızı girin");
      return;
    }
    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploader", name.trim());
    try {
      const res = await fetch(`/api/public/rsvp/${inviteCode}/gallery`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      setPhotosUploaded((prev) => prev + 1);
      toast.success(t("photoUploaded"));
    } catch {
      toast.error(t("photoUploadError"));
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !rsvpStatus) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/rsvp/${inviteCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          rsvpStatus,
          additionalGuests: additionalGuests.filter((g) => g.name.trim()),
          note: note.trim(),
          message: memoryMessage.trim() || undefined,
          source: source || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-[#252224]">
        <div className="w-8 h-8 border-2 border-[#d5d1ad]/20 border-t-[#d5d1ad] rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !invitation) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-[#252224] px-6">
        <div className="text-center">
          <HeartIcon />
          <h1 className="text-xl font-merienda text-white mt-4 mb-2">{t("invitationNotFound")}</h1>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-[#252224] px-6">
        <div className="text-center max-w-sm">
          <div className="flex justify-center mb-6">
            <SuccessIcon />
          </div>
          <h1 className="text-2xl font-merienda text-[#d5d1ad] mb-3">{t("successTitle")}</h1>
          <p className="text-white/50 font-sans">{t("successMessage")}</p>
        </div>
      </div>
    );
  }

  const weddingDateStr = new Date(invitation.weddingDate).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric", weekday: "long",
  });
  const totalPeople = 1 + additionalGuests.filter((g) => g.name.trim()).length;
  const hasExtras = invitation.hasGallery || invitation.hasMemoryBook;

  return (
    <div className="min-h-svh bg-[#252224] py-8 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#d5d1ad]/30" />
            <HeartIcon />
            <div className="h-px w-10 bg-[#d5d1ad]/30" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/40 mb-3 font-sans">
            {t("weAreGettingMarried")}
          </p>
          <h1 className="text-3xl sm:text-4xl font-merienda text-[#d5d1ad] mb-4">
            {invitation.brideName.split(" ")[0]} & {invitation.groomName.split(" ")[0]}
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm mb-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 7H14" stroke="currentColor" strokeWidth="1.2" />
              <path d="M5 1V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M11 1V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="font-sans">{weddingDateStr}</span>
            {invitation.weddingTime && <span>· {invitation.weddingTime}</span>}
          </div>
          {invitation.venueName && (
            <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1C4.8 1 3 2.8 3 5C3 8 7 13 7 13C7 13 11 8 11 5C11 2.8 9.2 1 7 1Z" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="font-sans">{invitation.venueName}</span>
            </div>
          )}
        </div>

        <div className="bg-[#1c1a1b] rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 font-sans">{t("yourName")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("yourNamePlaceholder")}
              className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/20 focus:border-[#d5d1ad]/50 focus:outline-none transition-all font-sans"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 font-sans">{t("phone")}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("phonePlaceholder")}
              className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/20 focus:border-[#d5d1ad]/50 focus:outline-none transition-all font-sans"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 font-sans">{t("subtitle")}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRsvpStatus("confirmed")}
                className={`h-14 rounded-xl border text-sm font-sans font-medium transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                  rsvpStatus === "confirmed"
                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                }`}
              >
                <AttendingIcon active={rsvpStatus === "confirmed"} />
                {t("attending")}
              </button>
              <button
                onClick={() => setRsvpStatus("declined")}
                className={`h-14 rounded-xl border text-sm font-sans font-medium transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                  rsvpStatus === "declined"
                    ? "border-rose-500/60 bg-rose-500/10 text-rose-400"
                    : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                }`}
              >
                <DeclineIcon active={rsvpStatus === "declined"} />
                {t("notAttending")}
              </button>
            </div>
          </div>

          {rsvpStatus === "confirmed" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/70 font-sans">
                  {t("additionalGuests")}
                  <span className="text-[#d5d1ad] ml-2 text-xs">
                    {t("totalPeople", { count: totalPeople })}
                  </span>
                </label>
                <button
                  onClick={handleAddGuest}
                  className="flex items-center gap-1.5 text-xs text-[#d5d1ad] hover:text-[#d5d1ad]/80 transition-colors font-sans cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 3V11M3 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {t("addGuest")}
                </button>
              </div>
              {additionalGuests.map((guest, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={guest.name}
                    onChange={(e) => handleGuestNameChange(index, e.target.value)}
                    placeholder={t("guestNamePlaceholder")}
                    className="flex-1 h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/20 focus:border-[#d5d1ad]/50 focus:outline-none transition-all font-sans"
                  />
                  <button
                    onClick={() => handleRemoveGuest(index)}
                    className="size-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 font-sans">{t("noteLabel")}</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("notePlaceholder")}
              rows={2}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#d5d1ad]/50 focus:outline-none transition-all resize-none font-sans"
            />
          </div>

          {hasExtras && (
            <>
              <div className="h-px bg-white/[0.06]" />

              <div className="flex items-center gap-2 flex-wrap">
                {invitation.hasGallery && (
                  <button
                    onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-sans font-medium transition-all cursor-pointer ${
                      showPhotoUpload
                        ? "border-[#d5d1ad]/40 bg-[#d5d1ad]/10 text-[#d5d1ad]"
                        : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                    }`}
                  >
                    <CameraIcon />
                    {t("uploadPhotos")}
                    {photosUploaded > 0 && (
                      <span className="bg-[#d5d1ad] text-[#252224] text-[10px] font-bold rounded-full size-4 flex items-center justify-center">
                        {photosUploaded}
                      </span>
                    )}
                  </button>
                )}
                {invitation.hasMemoryBook && (
                  <button
                    onClick={() => setShowMemoryMessage(!showMemoryMessage)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-sans font-medium transition-all cursor-pointer ${
                      showMemoryMessage
                        ? "border-[#d5d1ad]/40 bg-[#d5d1ad]/10 text-[#d5d1ad]"
                        : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                    }`}
                  >
                    <PenIcon />
                    {t("leaveMemory")}
                  </button>
                )}
              </div>

              {showPhotoUpload && invitation.hasGallery && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-xs text-white/30 font-sans">{t("uploadPhotosDesc")}</p>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto || !name.trim()}
                    className="w-full h-20 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-1.5 text-white/30 hover:border-[#d5d1ad]/30 hover:text-[#d5d1ad]/60 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {uploadingPhoto ? (
                      <div className="w-5 h-5 border-2 border-[#d5d1ad]/20 border-t-[#d5d1ad] rounded-full animate-spin" />
                    ) : (
                      <>
                        <UploadIcon />
                        <span className="text-xs font-sans">
                          {photosUploaded > 0 ? `${photosUploaded} fotoğraf yüklendi` : t("uploadPhotos")}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {showMemoryMessage && invitation.hasMemoryBook && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <textarea
                    value={memoryMessage}
                    onChange={(e) => setMemoryMessage(e.target.value)}
                    placeholder={t("leaveMemoryPlaceholder")}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#d5d1ad]/50 focus:outline-none transition-all resize-none font-sans"
                  />
                </div>
              )}
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !rsvpStatus || submitting}
            className="w-full h-12 rounded-xl bg-[#d5d1ad] text-[#252224] font-semibold font-sans text-sm hover:bg-[#d5d1ad]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-[#252224]/20 border-t-[#252224] rounded-full animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </button>
        </div>

        <p className="text-center text-xs text-white/20 mt-6 font-sans">
          Uygun Davet · uygundavet.com
        </p>
      </div>
    </div>
  );
}
