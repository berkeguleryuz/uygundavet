import type { EventProgramData } from "@davety/schema";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";
import { parseInlineDecorations } from "../../decorations/inline";

export function EventProgramView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<EventProgramData>) {
  const rootStyle = styleToCss(block.style);
  const { items, venueName, venueAddress, mapUrl } = block.data;

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
        {...click("heading")}
        className="font-display text-2xl text-center mb-6"
        style={fieldStyle(block, "heading")}
      >
        Etkinlik Programı
      </h3>

      <ul className="max-w-md mx-auto space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-4 border-b border-current/10 pb-2"
          >
            <div className="font-chakra text-sm tabular-nums opacity-80 w-14">
              {item.time}
            </div>
            <div className="flex-1 text-sm">
              {parseInlineDecorations(item.label)}
            </div>
          </li>
        ))}
      </ul>

      {venueName ? (
        <div className="mt-6 text-center max-w-md mx-auto">
          <div className="font-display text-lg" style={fieldStyle(block, "venueName")}>
            {parseInlineDecorations(venueName)}
          </div>
          {venueAddress ? (
            <div className="text-sm opacity-80 mt-1" style={fieldStyle(block, "venueAddress")}>
              {parseInlineDecorations(venueAddress)}
            </div>
          ) : null}
          {mapUrl ? (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-xs px-4 py-2 rounded-full border border-current/30 hover:bg-current/5"
            >
              Yol Tarifi Al
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
