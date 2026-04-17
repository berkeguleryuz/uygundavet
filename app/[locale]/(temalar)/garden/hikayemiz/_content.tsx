"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { LeafIcon } from "../_icons/LeafIcon";
import { BloomIcon } from "../_icons/BloomIcon";

interface Milestone {
  date: string;
  title: string;
  description: string;
  image?: string;
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=900&q=85",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85",
  "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=900&q=85",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=85",
];

const accents = [
  { border: "border-[#4a7c59]", text: "text-[#4a7c59]", bg: "bg-[#4a7c59]" },
  { border: "border-[#f9a620]", text: "text-[#f9a620]", bg: "bg-[#f9a620]" },
  { border: "border-[#b7472a]", text: "text-[#b7472a]", bg: "bg-[#b7472a]" },
  { border: "border-[#8ea68a]", text: "text-[#8ea68a]", bg: "bg-[#8ea68a]" },
  { border: "border-[#4a7c59]", text: "text-[#4a7c59]", bg: "bg-[#4a7c59]" },
];

function getMilestones(brideFirst: string, groomFirst: string): Milestone[] {
  return [
    {
      date: "İlk Tohum",
      title: "Her Şey Böyle Ekildi",
      description: `${brideFirst} ve ${groomFirst} ilk kez karşılaştıklarında, iki kalbin bahçesine aynı tohumun ekildiğini bilmiyorlardı.`,
      image: fallbackImages[0],
    },
    {
      date: "Filiz",
      title: "Birlikte Büyüme",
      description: `Saatlerce süren sohbetler, birlikte çiçek açan anlar... ${brideFirst} ve ${groomFirst} birbirleriyle kök saldılar.`,
      image: fallbackImages[1],
    },
    {
      date: "Yeşerme",
      title: "Sevgi Kök Saldı",
      description:
        "Her geçen gün birbirlerine daha çok güven duydular ve hayatlarının bahçesini ortak bir toprakta birleştirdiler.",
      image: fallbackImages[2],
    },
    {
      date: "Tomurcuk",
      title: "Evet!",
      description: `${groomFirst} diz çöktü ve ${brideFirst}'e hayatının sorusunu sordu. Cevap tabii ki "Evet!" oldu.`,
      image: fallbackImages[3],
    },
    {
      date: "Çiçek",
      title: "Tam Açılış",
      description:
        "Ve şimdi bu mutlu günü sizlerle paylaşmanın heyecanını yaşıyoruz. Bahçemizde sizi görmekten mutluluk duyacağız!",
      image: fallbackImages[4],
    },
  ];
}

export function HikayemizContent() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  const milestones: Milestone[] =
    wedding.storyMilestones && wedding.storyMilestones.length >= 1
      ? wedding.storyMilestones.map((m, i) => ({
          date: m.date,
          title: m.title,
          description: m.description,
          image: m.imageUrl || fallbackImages[i % fallbackImages.length],
        }))
      : getMilestones(brideFirst, groomFirst);

  return (
    <div className="min-h-svh bg-[#e3e9d6] pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative leaves */}
      <LeafIcon size={180} className="absolute -left-10 top-20 text-[#4a7c59]/15 rotate-[-20deg] pointer-events-none" />
      <LeafIcon size={160} className="absolute -right-8 top-[40%] text-[#b7472a]/15 rotate-[30deg] -scale-x-100 pointer-events-none" />
      <LeafIcon size={200} className="absolute -left-12 bottom-20 text-[#8ea68a]/20 rotate-[10deg] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <LeafIcon size={14} className="text-[#4a7c59] rotate-[-20deg]" />
            <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#4a7c59] font-semibold">
              {t("storyLabel")}
            </p>
            <LeafIcon size={14} className="text-[#4a7c59] rotate-[20deg] -scale-x-100" />
          </div>
          <h1 className="font-merienda text-4xl md:text-5xl text-[#2b3628]">
            {brideFirst} <span className="text-[#f9a620]">&amp;</span> {groomFirst}
          </h1>
          <p className="font-sans text-sm text-[#5e6b56] mt-4 max-w-lg mx-auto leading-relaxed">
            {t("storyText")}
          </p>
        </motion.div>

        <div className="space-y-24 md:space-y-32">
          {milestones.map((milestone, idx) => {
            const accent = accents[idx % accents.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
              >
                <div
                  className={`flex flex-col gap-8 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} md:items-center md:gap-12`}
                >
                  {milestone.image && (
                    <div className="md:w-1/2 relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_25px_50px_-25px_rgba(31,42,34,0.4)] border-[6px] border-[#f5f3ed]">
                      <Image
                        src={milestone.image}
                        alt={milestone.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}

                  <div className={`md:w-1/2 ${idx % 2 !== 0 ? "md:text-right" : ""}`}>
                    <div className={`${idx % 2 !== 0 ? "md:border-r-[3px] md:border-l-0 md:pr-6" : "border-l-[3px] pl-6"} ${accent.border}`}>
                      <div className={`inline-flex items-center gap-2 mb-3 ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                        <BloomIcon size={14} className={accent.text} />
                        <span className={`font-sans text-xs tracking-[0.25em] uppercase ${accent.text} font-bold`}>
                          {milestone.date}
                        </span>
                      </div>
                      <h3 className="font-merienda text-2xl md:text-3xl text-[#2b3628] mb-3">
                        {milestone.title}
                      </h3>
                      <p className="font-sans text-sm text-[#5e6b56] leading-[1.8]">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center items-center gap-3 mt-20"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#4a7c59]/50" />
          <BloomIcon size={18} className="text-[#f9a620]" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#4a7c59]/50" />
        </motion.div>
      </div>
    </div>
  );
}
