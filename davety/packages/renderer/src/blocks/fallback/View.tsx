import type { BlockViewProps } from "../types";

export function FallbackView({ block }: BlockViewProps) {
  return (
    <section className="px-6 py-8 border border-dashed border-muted-foreground/30 rounded-md text-center text-muted-foreground">
      <code className="text-xs">[block: {block.type}]</code>
      <p className="text-xs mt-1 opacity-70">Renderer henüz tanımlı değil (M3)</p>
    </section>
  );
}
