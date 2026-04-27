import type { StoryTimelineData } from "@davety/schema";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";
import { buildImgProps } from "../../media";

export function StoryTimelineView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<StoryTimelineData>) {
  const rootStyle = styleToCss(block.style);
  const { items } = block.data;

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
    <section className="px-2 py-10" style={rootStyle}>
      <h3
        {...click("heading")}
        className="font-display text-2xl text-center mb-8"
        style={fieldStyle(block, "heading")}
      >
        Hikayemiz
      </h3>

      <ol className="max-w-2xl mx-auto space-y-8">
        {items.map((m, i) => (
          <li
            key={i}
            className={`grid gap-4 md:grid-cols-2 items-center ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            {m.media?.url ? (
              <img
                {...buildImgProps(m.media)}
                alt=""
                className="w-full aspect-[4/3] object-cover rounded-md"
              />
            ) : (
              <div className="w-full aspect-[4/3] rounded-md bg-current/5 border border-dashed border-current/20" />
            )}

            <div>
              <div className="text-xs font-chakra uppercase tracking-[0.2em] opacity-70">
                {m.date}
              </div>
              <div className="font-display text-lg mt-1">{m.title}</div>
              <p className="text-sm mt-2 opacity-80">{m.description}</p>
            </div>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="text-center text-sm opacity-50 italic">
            Hikayeni eklemek için bloğu seç
          </li>
        ) : null}
      </ol>
    </section>
  );
}
