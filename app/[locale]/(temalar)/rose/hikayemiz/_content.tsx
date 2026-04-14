"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useWedding } from "../_lib/context";
import { t } from "../_lib/i18n";

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

const accentBorders = [
  "border-l-[#c75050]",
  "border-l-[#d4898a]",
  "border-l-[#c9a96e]",
  "border-l-[#8a5a5a]",
  "border-l-[#c75050]",
];

function getMilestones(brideFirst: string, groomFirst: string): Milestone[] {
  return [
    {
      date: "İlk Karşılaşma",
      title: "Her Şey Böyle Başladı",
      description: `${brideFirst} ve ${groomFirst} ilk kez karşılaştıklarında, hayatlarının değişeceğini bilmiyorlardı.`,
      image: fallbackImages[0],
    },
    {
      date: "İlk Buluşma",
      title: "Tanışma",
      description: `Saatlerce süren sohbetler, paylaşılan kahkahalar... ${brideFirst} ve ${groomFirst} birbirlerini keşfetmeye başladılar.`,
      image: fallbackImages[1],
    },
    {
      date: "Birlikte",
      title: "Aşk Büyüdü",
      description:
        "Her geçen gün birbirlerini daha iyi tanıdılar, birlikte yeni anıların kapısını aralayarak hayatlarını birleştirdiler.",
      image: fallbackImages[2],
    },
    {
      date: "Evlilik Teklifi",
      title: "Evet!",
      description: `${groomFirst} diz çöktü ve ${brideFirst}'e hayatının sorusunu sordu. Cevap tabii ki "Evet!" oldu.`,
      image: fallbackImages[3],
    },
    {
      date: "Düğün Günü",
      title: "Yeni Bir Başlangıç",
      description:
        "Ve şimdi bu mutlu günü sizlerle paylaşmanın heyecanını yaşıyoruz. Sizi de aramızda görmekten mutluluk duyacağız!",
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
    <div className="min-h-svh bg-[#f5ebe4] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-[#c75050] mb-3">
            {t("storyLabel")}
          </p>
          <h1 className="font-merienda text-4xl md:text-5xl bg-gradient-to-r from-[#c75050] via-[#d4898a] to-[#8a5a5a] bg-clip-text text-transparent">
            {brideFirst} & {groomFirst}
          </h1>
          <p className="font-sans text-sm text-[#1a1210]/50 mt-4 max-w-lg mx-auto leading-relaxed">
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
                className={`flex flex-col gap-8 ${
                  idx % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse"
                } md:items-center md:gap-12`}
              >
                {milestone.image && (
                  <div className="md:w-1/2 relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lg">
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
                  <div className={`${idx % 2 !== 0 ? "md:border-r-4 md:border-l-0 md:pr-6" : "border-l-4 pl-6"} ${accentBorders[idx % accentBorders.length]} ${idx % 2 !== 0 ? accentBorders[idx % accentBorders.length].replace("border-l-", "md:border-r-") : ""}`}>
                    <span className="inline-block font-sans text-xs tracking-[0.2em] uppercase text-[#c75050] mb-3 font-medium">
                      {milestone.date}
                    </span>
                    <h3 className="font-merienda text-2xl text-[#1a1210] mb-3">
                      {milestone.title}
                    </h3>
                    <p className="font-sans text-sm text-[#1a1210]/60 leading-[1.8]">
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
          className="flex justify-center mt-20"
        >
          <div className="w-24 h-1 rounded-full bg-gradient-to-r from-[#c75050] via-[#d4898a] to-[#8a5a5a]" />
        </motion.div>
      </div>
    </div>
  );
}
