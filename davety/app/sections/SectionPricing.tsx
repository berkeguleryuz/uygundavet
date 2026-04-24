import { PricingTable } from "@/app/components/PricingTable";

export function SectionPricing() {
  return (
    <section className="w-full px-4 md:px-8 pt-8 pb-20">
      <header
        className="mb-8 text-center max-w-2xl mx-auto"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
          Fiyatlandırma
        </div>
        <h1
          className="text-3xl md:text-4xl font-semibold text-foreground"
          style={{ fontFamily: "Merienda, serif" }}
        >
          Etkinliğine uygun paketi seç
        </h1>
        <p className="mt-3 text-sm md:text-base text-muted-foreground">
          Ücretsiz dene, beğenirsen bir üst pakete geç. Paket içerikleri aşağıda
          detaylı listelenmiştir.
        </p>
      </header>

      <PricingTable />
    </section>
  );
}
