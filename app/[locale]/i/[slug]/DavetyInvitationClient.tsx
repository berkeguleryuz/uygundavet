"use client";

import { useState } from "react";
import type { InvitationDoc } from "@davety/schema";
import { EnvelopeViewer, InvitationView } from "@davety/renderer";

export function DavetyInvitationClient({
  doc,
  slug,
}: {
  doc: InvitationDoc;
  slug: string;
}) {
  const [state, setState] = useState<"closed" | "open">("closed");

  return (
    <div className="w-full flex items-center justify-center">
      <EnvelopeViewer
        state={state}
        onToggle={setState}
        color={doc.theme.envelope?.color ?? "#f5eedb"}
        flapColor={doc.theme.envelope?.flapColor ?? "#eee0be"}
        liningPattern={
          (doc.theme.envelope?.liningPattern as "daisy" | "rose" | undefined) ??
          "daisy"
        }
        width={360}
        viewLabel="Görüntüle"
      >
        <div className="h-full w-full overflow-hidden">
          <InvitationView
            doc={doc}
            slug={slug}
            publicBase={process.env.NEXT_PUBLIC_DAVETY_URL ?? ""}
            className="text-xs"
          />
        </div>
      </EnvelopeViewer>

      {state === "open" ? (
        <div className="hidden">
          <span data-slug={slug} />
        </div>
      ) : null}
    </div>
  );
}
