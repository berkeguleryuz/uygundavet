import type { CustomSectionData } from "@davety/schema";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";
import { parseInlineDecorations } from "../../decorations/inline";

export function CustomSectionView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<CustomSectionData>) {
  const rootStyle = styleToCss(block.style);
  const { title, body, items } = block.data;

  const click = (id: string) =>
    editable && onFieldSelect
      ? {
          "data-field-id": id,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onFieldSelect(id);
          },
          className: "cursor-pointer hover:bg-yellow-100/30 rounded px-1",
        }
      : {};

  return (
    <section className="px-2 py-10" style={rootStyle}>
      <h3
        {...click("title")}
        className="font-display text-2xl text-center mb-3"
        style={fieldStyle(block, "title")}
      >
        {parseInlineDecorations(title)}
      </h3>

      {body ? (
        <p
          {...click("body")}
          className="text-sm text-center max-w-lg mx-auto opacity-80 mb-5"
          style={fieldStyle(block, "body")}
        >
          {parseInlineDecorations(body)}
        </p>
      ) : null}

      {items && items.length > 0 ? (
        <ul className="max-w-md mx-auto space-y-3">
          {items.map((it, i) => (
            <li key={i} className="border-b border-current/10 pb-2">
              <div className="font-medium text-sm">
                {parseInlineDecorations(it.title)}
              </div>
              {it.description ? (
                <div className="text-xs opacity-70 mt-0.5">
                  {parseInlineDecorations(it.description)}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
