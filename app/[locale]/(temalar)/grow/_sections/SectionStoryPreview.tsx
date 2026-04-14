"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "../_components/ScrollReveal";
import { useWedding } from "../_lib/context";

const BASE = "/lavanta";

export function SectionStoryPreview() {
  const wedding = useWedding();
  const brideFirst = wedding.brideName.split(" ")[0];
  const groomFirst = wedding.groomName.split(" ")[0];

  return (
    <section className="relative bg-[#1c1a1b] overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-[#d5d1ad]/8 to-transparent" />

      <div className="grid md:grid-cols-[1fr_1.1fr] min-h-[600px] md:min-h-[700px]">
        <ScrollReveal className="relative order-2 md:order-1">
          <div className="relative h-full min-h-[400px] md:min-h-0">
            <Image
              src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&q=80"
              alt="Çiftin hikâyesi"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1c1a1b]/80 hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1a1b] via-transparent to-transparent md:hidden" />

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden md:block absolute -right-8 bottom-16 w-48 lg:w-56 aspect-[3/4] rounded-xl overflow-hidden border-[3px] border-[#1c1a1b] shadow-2xl shadow-black/40"
            >
              <Image
                src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80"
                alt=""
                fill
                className="object-cover"
                sizes="224px"
              />
            </motion.div>
          </div>
        </ScrollReveal>

        <div className="relative order-1 md:order-2 flex items-center py-16 md:py-24 px-8 md:px-16 lg:px-24">
          <div className="w-full max-w-md">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-[#d5d1ad]/25" />
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#d5d1ad]/40">
                  Hikayemiz
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="font-merienda text-3xl md:text-4xl lg:text-[2.75rem] text-[#d5d1ad] leading-[1.2] mb-7">
                {brideFirst} & {groomFirst}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="font-sans text-[15px] text-white/40 leading-[1.9] mb-4">
                Hayatlarımızı birleştirmeye karar verdik. Tanıştığımız ilk günden
                bu yana birlikte geçirdiğimiz her an, bizi bugünlere taşıdı.
              </p>
              <p className="font-sans text-[15px] text-white/40 leading-[1.9] mb-10">
                Bu yolculuğun hikâyesini sizinle paylaşmak istiyoruz.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Link
                href={`${BASE}/hikayemiz`}
                className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-[#d5d1ad] hover:text-[#d5d1ad]/70 transition-colors group"
              >
                Hikayemizi Okuyun
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
