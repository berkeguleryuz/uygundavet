"use client";

import { useEditorStore } from "@/src/store/editor-store";
import { useAssetUpload } from "@/src/hooks/useAssetUpload";

export function MusicTab() {
  const doc = useEditorStore((s) => s.doc);
  const docId = useEditorStore((s) => s.docId);
  const updateTheme = useEditorStore((s) => s.updateTheme);
  const { pick, busy } = useAssetUpload(docId);

  if (!doc) return null;

  return (
    <div className="border-t border-border pt-4 mt-2 flex flex-col gap-3">
      <div className="text-xs font-medium">Arkaplan Müziği</div>

      <input
        type="url"
        value={doc.theme.bgMusicUrl ?? ""}
        onChange={(e) => updateTheme({ bgMusicUrl: e.target.value })}
        placeholder="Müzik URL'i (mp3/ogg)"
        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
      />

      <button
        onClick={async () => {
          const media = await pick("audio/*");
          if (media?.url) updateTheme({ bgMusicUrl: media.url });
        }}
        disabled={busy}
        className="text-xs rounded-md border border-border py-2 cursor-pointer hover:bg-muted disabled:opacity-50"
      >
        {busy ? "..." : "Müzik Yükle"}
      </button>

      {doc.theme.bgMusicUrl ? (
        <audio controls className="w-full">
          <source src={doc.theme.bgMusicUrl} />
        </audio>
      ) : null}
    </div>
  );
}
