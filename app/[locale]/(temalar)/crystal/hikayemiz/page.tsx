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

export default function HikayemizPage() {
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
    <div className="min-h-svh pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="w-12 h-px bg-[#b49a7c] mb-6" />
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#a09ba6] mb-3">
            {t("storyLabel")}
          </p>
          <h1 className="font-merienda text-3xl md:text-4xl text-[#1a1a2e]">
            {brideFirst} & {groomFirst}
          </h1>
          <p className="font-sans text-sm text-[#6d6a75] mt-3 max-w-lg leading-relaxed">
            {t("storyText")}
          </p>
        </motion.div>

        <div className="space-y-24 md:space-y-32">
          {milestones.map((milestone, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
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
                  <div className="md:w-1/2 relative aspect-[4/5] overflow-hidden">
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
                  <span className="inline-block font-sans text-[10px] tracking-[0.2em] uppercase text-[#b49a7c] mb-3">
                    {milestone.date}
                  </span>
                  <h3 className="font-merienda text-2xl text-[#1a1a2e] mb-3">
                    {milestone.title}
                  </h3>
                  <p className="font-sans text-sm text-[#6d6a75] leading-[1.8]">
                    {milestone.description}
                  </p>
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
          className="flex justify-start mt-20"
        >
          <div className="w-12 h-px bg-[#b49a7c]" />
        </motion.div>
      </div>
    </div>
  );
}
