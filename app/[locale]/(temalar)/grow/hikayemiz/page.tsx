"use client";

import { useWedding } from "../_lib/context";
import { OrnamentalDivider } from "../_components/OrnamentalDivider";
import { ScrollReveal } from "../_components/ScrollReveal";
import Image from "next/image";

interface Milestone {
  date: string;
  title: string;
  description: string;
  image?: string;
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
];

function getMilestones(brideFirst: string, groomFirst: string): Milestone[] {
  return [
    {
      date: "İlk Karşılaşma",
      title: "Her Şey Böyle Başladı",
      description: `${brideFirst} ve ${groomFirst} ilk kez karşılaştıklarında, hayatlarının değişeceğini bilmiyorlardı. O an basit bir selamlaşma ile başlayan hikâye, bugünlere uzandı.`,
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
    <div className="min-h-svh pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <OrnamentalDivider className="mb-6" />
          <p className="font-sans text-xs tracking-[3px] uppercase text-white/30">
            Hikayemiz
          </p>
          <h1 className="font-merienda text-3xl md:text-4xl text-[#d5d1ad] mt-3">
            {brideFirst} & {groomFirst}
          </h1>
        </ScrollReveal>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-[#d5d1ad]/15 -translate-x-1/2" />

          {milestones.map((milestone, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.1}>
              <div
                className={`relative flex items-start gap-8 mb-16 last:mb-0 ${
                  idx % 2 === 0
                    ? "md:flex-row"
                    : "md:flex-row-reverse md:text-right"
                }`}
              >
                <div className="absolute left-6 md:left-1/2 top-2 w-3 h-3 rounded-full bg-[#d5d1ad] border-2 border-[#252224] -translate-x-1/2 z-10" />

                <div className="ml-14 md:ml-0 md:w-[calc(50%-2rem)]">
                  <span className="inline-block font-sans text-xs tracking-wider uppercase text-[#d5d1ad]/60 bg-[#d5d1ad]/10 px-3 py-1 rounded-full mb-3">
                    {milestone.date}
                  </span>
                  <h3 className="font-chakra text-lg uppercase tracking-wider text-white mb-2">
                    {milestone.title}
                  </h3>
                  <p className="font-sans text-sm text-white/60 leading-relaxed">
                    {milestone.description}
                  </p>
                  {milestone.image && (
                    <div className="mt-4 rounded-2xl overflow-hidden aspect-[4/3] relative">
                      <Image
                        src={milestone.image}
                        alt={milestone.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                </div>

                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
