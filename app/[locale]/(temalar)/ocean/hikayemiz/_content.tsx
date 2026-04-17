"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { WaveIcon } from "../_icons/WaveIcon";
import { CompassIcon } from "../_icons/CompassIcon";

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

function getMilestones(brideFirst: string, groomFirst: string): Milestone[] {
  return [
    {
      date: "Denize Açılış",
      title: "Rotalar Kesişti",
      description: `${brideFirst} ve ${groomFirst} aynı ufka bakan iki gemi olarak buluştuklarında rotaları ilk kez kesişti.`,
      image: fallbackImages[0],
    },
    {
      date: "Seyir",
      title: "Aynı Pusula",
      description: `Saatlerce süren konuşmalar, aynı yıldızları takip eden iki ruh... ${brideFirst} ve ${groomFirst} aynı pusulaya güvendiler.`,
      image: fallbackImages[1],
    },
    {
      date: "Fırtına & Sessizlik",
      title: "Birlikte Seyir",
      description: "Her dalga, her rüzgar onları daha çok kenetledi. İki yolcu tek bir rotaya dönüştü.",
      image: fallbackImages[2],
    },
    {
      date: "Teklif",
      title: "Demir Atma",
      description: `${groomFirst} güvertede diz çöktü ve ${brideFirst}'e hayatının sorusunu sordu. Cevap tabii ki "Evet!" oldu.`,
      image: fallbackImages[3],
    },
    {
      date: "Liman",
      title: "Sonsuz Rota",
      description: "Ve şimdi bu güzel günü sizlerle paylaşmanın heyecanını yaşıyoruz. Sizi güvertede görmekten mutluluk duyacağız.",
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
    <div className="min-h-svh bg-[#0d1620] pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Background deep-water glow */}
      <div aria-hidden className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-96 bg-[#2d8b8b]/15 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#a8dadc]/50" />
            <WaveIcon size={16} className="text-[#a8dadc]" />
            <div className="h-px w-10 bg-[#a8dadc]/50" />
          </div>
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#a8dadc] font-bold mb-4">
            {t("storyLabel")}
          </p>
          <h1 className="font-merienda text-4xl md:text-5xl text-[#f1faee]">
            {brideFirst} <span className="text-[#a8dadc]">&amp;</span> {groomFirst}
          </h1>
          <p className="font-sans text-sm text-[#f1faee]/55 mt-4 max-w-lg mx-auto leading-relaxed">
            {t("storyText")}
          </p>
        </motion.div>

        <div className="space-y-24 md:space-y-32">
          {milestones.map((milestone, idx) => (
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
                  <div className="md:w-1/2 relative aspect-[4/5] overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)] border border-[#a8dadc]/20">
                    <Image
                      src={milestone.image}
                      alt={milestone.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#2d8b8b]/20 to-transparent mix-blend-multiply" />
                  </div>
                )}

                <div className={`md:w-1/2 ${idx % 2 !== 0 ? "md:text-right" : ""}`}>
                  <div className={`${idx % 2 !== 0 ? "md:border-r-2 md:border-l-0 md:pr-6" : "border-l-2 pl-6"} border-[#a8dadc]/40`}>
                    <div className={`inline-flex items-center gap-2 mb-3 ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                      <CompassIcon size={14} className="text-[#a8dadc]" />
                      <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#a8dadc] font-bold">
                        0{idx + 1} · {milestone.date}
                      </span>
                    </div>
                    <h3 className="font-merienda text-2xl md:text-3xl text-[#f1faee] mb-3">
                      {milestone.title}
                    </h3>
                    <p className="font-sans text-sm text-[#f1faee]/60 leading-[1.8]">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center items-center gap-3 mt-20"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#a8dadc]/60" />
          <WaveIcon size={20} className="text-[#a8dadc]" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#a8dadc]/60" />
        </motion.div>
      </div>
    </div>
  );
}
