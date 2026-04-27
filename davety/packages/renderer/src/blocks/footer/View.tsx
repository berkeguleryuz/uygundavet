import type { FooterData } from "@davety/schema";
import { alignClasses, fieldStyle, styleToCss, type BlockViewProps } from "../types";

export function FooterView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<FooterData>) {
  const rootStyle = styleToCss(block.style);

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
    <footer
      className={`px-6 py-6 text-xs opacity-60 ${alignClasses(block.style.align).split(" ").filter((c) => c.startsWith("text-")).join(" ")}`}
      style={rootStyle}
    >
      <div {...click("text")} style={fieldStyle(block, "text")}>
        {block.data.text || "davety ile oluşturuldu"}
      </div>
    </footer>
  );
}
