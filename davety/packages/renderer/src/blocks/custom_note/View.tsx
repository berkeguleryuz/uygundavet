import type { CustomNoteData } from "@davety/schema";
import { alignClasses, fieldStyle, styleToCss, type BlockViewProps } from "../types";

export function CustomNoteView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<CustomNoteData>) {
  const rootStyle = styleToCss(block.style);
  const { title, body } = block.data;

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
    <section
      className={`px-2 py-10 flex flex-col ${alignClasses(block.style.align)}`}
      style={rootStyle}
    >
      {title ? (
        <h3
          {...click("title")}
          className="font-display text-2xl mb-3"
          style={fieldStyle(block, "title")}
        >
          {title}
        </h3>
      ) : null}
      <p
        {...click("body")}
        className="text-sm max-w-lg leading-relaxed opacity-90 whitespace-pre-wrap"
        style={fieldStyle(block, "body")}
      >
        {body}
      </p>
    </section>
  );
}
