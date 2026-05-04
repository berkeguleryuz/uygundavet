"use client";

import { useState } from "react";
import { Heart, MapPin, Users, ListChecks, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PersonName {
  firstName: string;
  lastName: string;
}
interface FamilyInfo {
  father: PersonName;
  mother: PersonName;
}

export interface CustomerEditorData {
  bride: PersonName;
  groom: PersonName;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  brideFamily: FamilyInfo;
  groomFamily: FamilyInfo;
  eventSchedule: { time: string; label: string }[];
}

interface CustomerEditorProps {
  customerId: string;
  initial: CustomerEditorData;
  onSaved: (next: CustomerEditorData) => void;
}

const emptyPerson: PersonName = { firstName: "", lastName: "" };

function toDateInput(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[11px] uppercase tracking-wider text-white/40 font-sans">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 rounded-xl border border-white/10 bg-white/[0.02] px-3 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-hidden transition-all font-sans"
    />
  </label>
);

export function CustomerEditor({ customerId, initial, onSaved }: CustomerEditorProps) {
  const [data, setData] = useState<CustomerEditorData>(() => ({
    ...initial,
    bride: { ...emptyPerson, ...initial.bride },
    groom: { ...emptyPerson, ...initial.groom },
    brideFamily: {
      father: { ...emptyPerson, ...initial.brideFamily?.father },
      mother: { ...emptyPerson, ...initial.brideFamily?.mother },
    },
    groomFamily: {
      father: { ...emptyPerson, ...initial.groomFamily?.father },
      mother: { ...emptyPerson, ...initial.groomFamily?.mother },
    },
    eventSchedule: initial.eventSchedule || [],
    weddingDate: toDateInput(initial.weddingDate),
  }));
  const [saving, setSaving] = useState(false);

  const setBride = (key: keyof PersonName, value: string) =>
    setData((d) => ({ ...d, bride: { ...d.bride, [key]: value } }));
  const setGroom = (key: keyof PersonName, value: string) =>
    setData((d) => ({ ...d, groom: { ...d.groom, [key]: value } }));
  const setBrideFamily = (parent: keyof FamilyInfo, key: keyof PersonName, value: string) =>
    setData((d) => ({
      ...d,
      brideFamily: { ...d.brideFamily, [parent]: { ...d.brideFamily[parent], [key]: value } },
    }));
  const setGroomFamily = (parent: keyof FamilyInfo, key: keyof PersonName, value: string) =>
    setData((d) => ({
      ...d,
      groomFamily: { ...d.groomFamily, [parent]: { ...d.groomFamily[parent], [key]: value } },
    }));

  const updateScheduleRow = (i: number, key: "time" | "label", value: string) =>
    setData((d) => ({
      ...d,
      eventSchedule: d.eventSchedule.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)),
    }));
  const addScheduleRow = () =>
    setData((d) => ({ ...d, eventSchedule: [...d.eventSchedule, { time: "", label: "" }] }));
  const removeScheduleRow = (i: number) =>
    setData((d) => ({ ...d, eventSchedule: d.eventSchedule.filter((_, idx) => idx !== i) }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        bride: data.bride,
        groom: data.groom,
        weddingDate: data.weddingDate ? new Date(data.weddingDate).toISOString() : undefined,
        weddingTime: data.weddingTime,
        venueName: data.venueName,
        venueAddress: data.venueAddress,
        brideFamily: data.brideFamily,
        groomFamily: data.groomFamily,
        eventSchedule: data.eventSchedule.filter((r) => r.time || r.label),
      };
      const res = await fetch(`/api/admin/websites/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("Bilgiler kaydedildi");
        onSaved(data);
      } else {
        toast.error("Kaydedilemedi");
      }
    } catch {
      toast.error("Hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-white/50" />
          <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">Çift Bilgileri</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Gelin Adı" value={data.bride.firstName} onChange={(v) => setBride("firstName", v)} />
          <Field label="Gelin Soyadı" value={data.bride.lastName} onChange={(v) => setBride("lastName", v)} />
          <Field label="Damat Adı" value={data.groom.firstName} onChange={(v) => setGroom("firstName", v)} />
          <Field label="Damat Soyadı" value={data.groom.lastName} onChange={(v) => setGroom("lastName", v)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-white/10 pt-4">
          <Field
            label="Düğün Tarihi"
            type="date"
            value={data.weddingDate}
            onChange={(v) => setData((d) => ({ ...d, weddingDate: v }))}
          />
          <Field
            label="Saat"
            type="time"
            value={data.weddingTime}
            onChange={(v) => setData((d) => ({ ...d, weddingTime: v }))}
          />
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-white/50" />
          <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">Mekan</h3>
        </div>
        <Field
          label="Mekan Adı"
          value={data.venueName}
          onChange={(v) => setData((d) => ({ ...d, venueName: v }))}
        />
        <Field
          label="Adres"
          value={data.venueAddress}
          onChange={(v) => setData((d) => ({ ...d, venueAddress: v }))}
        />
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-white/50" />
          <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">Aile Bilgileri</h3>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/40 font-sans mb-2">Gelin Ailesi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Baba Adı"
              value={data.brideFamily.father.firstName}
              onChange={(v) => setBrideFamily("father", "firstName", v)}
            />
            <Field
              label="Baba Soyadı"
              value={data.brideFamily.father.lastName}
              onChange={(v) => setBrideFamily("father", "lastName", v)}
            />
            <Field
              label="Anne Adı"
              value={data.brideFamily.mother.firstName}
              onChange={(v) => setBrideFamily("mother", "firstName", v)}
            />
            <Field
              label="Anne Soyadı"
              value={data.brideFamily.mother.lastName}
              onChange={(v) => setBrideFamily("mother", "lastName", v)}
            />
          </div>
        </div>
        <div className="border-t border-white/10 pt-4">
          <p className="text-[11px] uppercase tracking-wider text-white/40 font-sans mb-2">Damat Ailesi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Baba Adı"
              value={data.groomFamily.father.firstName}
              onChange={(v) => setGroomFamily("father", "firstName", v)}
            />
            <Field
              label="Baba Soyadı"
              value={data.groomFamily.father.lastName}
              onChange={(v) => setGroomFamily("father", "lastName", v)}
            />
            <Field
              label="Anne Adı"
              value={data.groomFamily.mother.firstName}
              onChange={(v) => setGroomFamily("mother", "firstName", v)}
            />
            <Field
              label="Anne Soyadı"
              value={data.groomFamily.mother.lastName}
              onChange={(v) => setGroomFamily("mother", "lastName", v)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-white/50" />
            <h3 className="text-sm font-chakra uppercase tracking-[0.12em] text-white/70">Etkinlik Programı</h3>
          </div>
          <button
            type="button"
            onClick={addScheduleRow}
            className="text-xs text-white/60 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Ekle
          </button>
        </div>
        {data.eventSchedule.length === 0 && (
          <p className="text-xs text-white/40 font-sans">Henüz program eklenmemiş.</p>
        )}
        {data.eventSchedule.map((row, i) => (
          <div key={i} className="grid grid-cols-[100px_1fr_auto] gap-2 items-center">
            <input
              type="text"
              value={row.time}
              onChange={(e) => updateScheduleRow(i, "time", e.target.value)}
              placeholder="19:30"
              className="h-9 rounded-lg border border-white/10 bg-white/[0.02] px-3 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-hidden font-sans"
            />
            <input
              type="text"
              value={row.label}
              onChange={(e) => updateScheduleRow(i, "label", e.target.value)}
              placeholder="Tören başlangıcı"
              className="h-9 rounded-lg border border-white/10 bg-white/[0.02] px-3 text-sm text-white placeholder:text-white/20 focus:border-white/30 focus:outline-hidden font-sans"
            />
            <button
              type="button"
              onClick={() => removeScheduleRow(i)}
              className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 flex items-center justify-center cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="h-11 px-6 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-sm font-sans font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Tüm Değişiklikleri Kaydet
      </button>
    </div>
  );
}
