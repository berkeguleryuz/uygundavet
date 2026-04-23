import type { HeroData } from "@davety/schema";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";
import { buildImgProps } from "../../media";

export function HeroView({ block, onFieldSelect, editable }: BlockViewProps<HeroData>) {
  const { brideName, groomName, subtitle, description, media } = block.data;
  const rootStyle = styleToCss(block.style);

  const selectable = (id: string) =>
    editable && onFieldSelect
      ? {
          "data-field-id": id,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            onFieldSelect(id);
          },
        }
      : {};

  return (
    <section className="relative overflow-hidden" style={rootStyle}>
      {media?.url ? (
        <div className="absolute inset-0 -z-10">
          {media.mediaType === "video" ? (
            <video
              src={media.url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <img
              {...buildImgProps(media)}
              alt=""
              className="w-full h-full object-cover opacity-60"
            />
          )}
        </div>
      ) : null}

      <div className="relative px-8 py-14 flex flex-col gap-3 items-center text-center">
        <div
          {...selectable("coupleNames")}
          className={
            editable ? "cursor-pointer hover:bg-yellow-100/30 rounded px-2" : ""
          }
          style={fieldStyle(block, "coupleNames")}
        >
          <div>{brideName}</div>
          <div className="opacity-70 text-[0.8em]">&</div>
          <div>{groomName}</div>
        </div>

        {subtitle ? (
          <h2
            {...selectable("subtitle")}
            className={
              editable ? "cursor-pointer hover:bg-yellow-100/30 rounded px-2 text-2xl font-sans" : "text-2xl font-sans"
            }
            style={fieldStyle(block, "subtitle")}
          >
            {subtitle}
          </h2>
        ) : null}

        {description ? (
          <p
            {...selectable("description")}
            className={
              editable
                ? "cursor-pointer hover:bg-yellow-100/30 rounded px-2 max-w-md text-base font-sans"
                : "max-w-md text-base font-sans"
            }
            style={fieldStyle(block, "description")}
          >
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
