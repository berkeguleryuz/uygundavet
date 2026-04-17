"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";
import { SunIcon } from "../_icons/SunIcon";

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
  { text: "text-[#f4a900]", bg: "bg-[#f4a900]" },
  { text: "text-[#c1666b]", bg: "bg-[#c1666b]" },
  { text: "text-[#8a7560]", bg: "bg-[#8a7560]" },
  { text: "text-[#f4a900]", bg: "bg-[#f4a900]" },
  { text: "text-[#c1666b]", bg: "bg-[#c1666b]" },
];

function getMilestones(brideFirst: string, groomFirst: string): Milestone[] {
  return [
    {
      date: "Şafak",
      title: "İlk Işık",
      description: `${brideFirst} ve ${groomFirst} ilk kez karşılaştıklarında, bu şafağın ardında altın bir günün geleceğini bilmiyorlardı.`,
      image: fallbackImages[0],
    },
    {
      date: "Sabah",
      title: "Tanışma",
      description: `Saatlerce süren sohbetler, paylaşılan kahkahalar... ${brideFirst} ve ${groomFirst} birbirlerini keşfetmeye başladılar.`,
      image: fallbackImages[1],
    },
    {
      date: "Öğle",
      title: "Günün Zirvesi",
      description: "Sevgi en parlak saatindeydi. Her gün birbirlerine daha çok güven duydular.",
      image: fallbackImages[2],
    },
    {
      date: "İkindi",
      title: "Söz",
      description: `${groomFirst} diz çöktü ve ${brideFirst}'e hayatının sorusunu sordu. Cevap tabii ki "Evet!" oldu.`,
      image: fallbackImages[3],
    },
    {
      date: "Altın Saat",
      title: "Bugün",
      description: "Ve şimdi altın saatimizi sizlerle paylaşmaya hazırız. Bu sıcak anda bizimle olmanız en büyük hediyemiz olacak.",
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
    <div className="min-h-svh bg-[#d4b896]/30 pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
      <div aria-hidden className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,_rgba(244,169,0,0.3)_0%,_rgba(244,169,0,0)_70%)] pointer-events-none" />
      <div aria-hidden className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,_rgba(193,102,107,0.2)_0%,_rgba(193,102,107,0)_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#c1666b]/50" />
            <SunIcon size={16} className="text-[#f4a900]" />
            <div className="h-px w-10 bg-[#c1666b]/50" />
          </div>
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-[#c1666b] font-bold mb-4">
            {t("storyLabel")}
          </p>
          <h1 className="font-merienda text-4xl md:text-5xl text-[#4a403a]">
            {brideFirst} <span className="text-[#f4a900]">&amp;</span> {groomFirst}
          </h1>
          <p className="font-sans text-sm text-[#4a403a]/70 mt-4 max-w-lg mx-auto leading-relaxed">
            {t("storyText")}
          </p>
        </motion.div>

        <div className="space-y-24 md:space-y-32">
          {milestones.map((milestone, idx) => {
            const accent = accents[idx % accents.length];
            const tilt = idx % 2 === 0 ? "-rotate-1" : "rotate-1";
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
                    <div className={`md:w-1/2 relative ${tilt} hover:rotate-0 transition-transform duration-500`}>
                      <div className="relative bg-[#faf5ec] p-3 pb-10 rounded-sm shadow-[0_25px_50px_-20px_rgba(74,64,58,0.45)]">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                          <Image
                            src={milestone.image}
                            alt={milestone.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-[#f4a900]/10 mix-blend-multiply" />
                        </div>
                        {/* Wax seal */}
                        <div
                          className={`absolute -top-4 ${idx % 2 === 0 ? "-right-4" : "-left-4"} w-14 h-14 rounded-full ${accent.bg} shadow-lg flex items-center justify-center rotate-12`}
                        >
                          <SunIcon size={20} className="text-[#faf5ec] -rotate-12" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`md:w-1/2 ${idx % 2 !== 0 ? "md:text-right" : ""}`}>
                    <div className={`inline-flex items-center gap-2 mb-3 ${idx % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                      <SunIcon size={14} className={accent.text} />
                      <span className={`font-sans text-xs tracking-[0.3em] uppercase ${accent.text} font-bold`}>
                        0{idx + 1} · {milestone.date}
                      </span>
                    </div>
                    <h3 className="font-merienda text-2xl md:text-3xl text-[#4a403a] mb-3">
                      {milestone.title}
                    </h3>
                    <p className="font-sans text-sm text-[#4a403a]/70 leading-[1.8]">
                      {milestone.description}
                    </p>
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
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c1666b]/60" />
          <SunIcon size={20} className="text-[#f4a900]" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c1666b]/60" />
        </motion.div>
      </div>
    </div>
  );
}
