import { PillNav } from "@/app/components/PillNav";
import { Footer } from "@/app/components/Footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PillNav />
      {children}
      <Footer />
    </>
  );
}
