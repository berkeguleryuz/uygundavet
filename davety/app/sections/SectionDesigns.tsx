import { DesignsGrid } from "@/app/components/DesignsGrid";

export function SectionDesigns() {
  return (
    <section className="w-full px-4 md:px-8 pt-8 pb-20">
      <header className="mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
        <h1
          className="text-xl md:text-2xl font-semibold text-foreground"
          style={{ fontFamily: "Merienda, serif" }}
        >
          Tarzınızı yansıtacak davetiyenize sahip olun
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Beğendiğiniz davetiyenin üzerinde yer alan &apos;Düzenle&apos;
          butonuna tıklayarak davetiyenizi oluşturabilirsiniz.
        </p>
      </header>

      <DesignsGrid defaultTab="all" />
    </section>
  );
}
