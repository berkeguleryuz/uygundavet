import type { CtaData } from "@davety/schema";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";

export function CtaView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<CtaData>) {
  const rootStyle = styleToCss(block.style);
  const { label, href } = block.data;

  const click = (id: string) =>
    editable && onFieldSelect
      ? {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onFieldSelect(id);
          },
          className: "cursor-pointer hover:bg-yellow-100/30 rounded px-1",
        }
      : {};

  return (
    <section className="px-6 py-8 text-center" style={rootStyle}>
      {href && !editable ? (
        <a
          href={href}
          className="inline-block rounded-full bg-current/90 text-white px-8 py-3 font-chakra uppercase tracking-[0.2em] text-xs hover:opacity-90"
        >
          {label}
        </a>
      ) : (
        <button
          {...click("label")}
          className="inline-block rounded-full bg-current/90 text-white px-8 py-3 font-chakra uppercase tracking-[0.2em] text-xs"
          style={fieldStyle(block, "label")}
        >
          {label}
        </button>
      )}
    </section>
  );
}
