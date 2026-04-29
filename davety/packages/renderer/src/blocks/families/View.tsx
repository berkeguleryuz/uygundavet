import type { FamiliesData } from "@davety/schema";
import { fieldStyle, styleToCss, type BlockViewProps } from "../types";

export function FamiliesView({
  block,
  editable,
  onFieldSelect,
}: BlockViewProps<FamiliesData>) {
  const { bride, groom } = block.data;
  const rootStyle = styleToCss(block.style);

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
      <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
        <Column
          title={bride.title}
          members={bride.members}
          titleId="brideTitle"
          membersId="brideMembers"
          click={click}
          block={block}
        />
        <Column
          title={groom.title}
          members={groom.members}
          titleId="groomTitle"
          membersId="groomMembers"
          click={click}
          block={block}
        />
      </div>
    </section>
  );
}

function Column({
  title,
  members,
  titleId,
  membersId,
  click,
  block,
}: {
  title: string;
  members: string[];
  titleId: string;
  membersId: string;
  click: (id: string) => object;
  block: import("@davety/schema").Block<FamiliesData>;
}) {
  return (
    <div className="text-center">
      <h3
        {...click(titleId)}
        className="font-display text-lg underline underline-offset-4"
        style={fieldStyle(block, titleId)}
      >
        {title}
      </h3>
      <div
        {...click(membersId)}
        className="mt-2 text-sm space-y-0.5"
        style={fieldStyle(block, membersId)}
      >
        {members.length > 0 ? (
          members.map((m, i) => <div key={i}>{m}</div>)
        ) : (
          <div className="opacity-40 italic">—</div>
        )}
      </div>
    </div>
  );
}
