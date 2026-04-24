import type { CustomNoteData } from "@davety/schema";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";

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
    <section className="px-6 py-10" style={rootStyle}>
      {title ? (
        <h3
          {...click("title")}
          className="font-display text-2xl text-center mb-3"
          style={fieldStyle(block, "title")}
        >
          {title}
        </h3>
      ) : null}
      <p
        {...click("body")}
        className="text-sm text-center max-w-lg mx-auto leading-relaxed opacity-90 whitespace-pre-wrap"
        style={fieldStyle(block, "body")}
      >
        {body}
      </p>
    </section>
  );
}
