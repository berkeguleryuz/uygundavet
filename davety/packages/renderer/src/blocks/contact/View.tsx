import type { ContactData } from "@davety/schema";
import { alignClasses, fieldStyle, styleToCss, type BlockViewProps } from "../types";

export function ContactView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<ContactData>) {
  const rootStyle = styleToCss(block.style);
  const { venueName, venueAddress, phone } = block.data;

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
    <section
      className={`px-6 py-8 flex flex-col ${alignClasses(block.style.align)}`}
      style={rootStyle}
    >
      {venueName ? (
        <div
          {...click("venueName")}
          className="font-display text-xl"
          style={fieldStyle(block, "venueName")}
        >
          {venueName}
        </div>
      ) : null}
      {venueAddress ? (
        <p
          {...click("venueAddress")}
          className="text-sm opacity-80 mt-1 max-w-md mx-auto"
          style={fieldStyle(block, "venueAddress")}
        >
          {venueAddress}
        </p>
      ) : null}
      {phone ? (
        <a href={`tel:${phone}`} className="inline-block mt-3 text-sm underline">
          {phone}
        </a>
      ) : null}
    </section>
  );
}
