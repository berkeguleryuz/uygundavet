"use client";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  ListsToggle,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { forwardRef } from "react";

type Props = {
  markdown: string;
  onChange: (md: string) => void;
};

async function imageUploadHandler(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/clodron/blog/upload-image", {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = (await res.json()) as { url: string };
  return data.url;
}

export const MdxEditorClient = forwardRef<MDXEditorMethods, Props>(
  function MdxEditorClient({ markdown, onChange }, ref) {
    return (
      <MDXEditor
        ref={ref}
        markdown={markdown}
        onChange={onChange}
        className="dark-theme dark-editor"
        contentEditableClassName="prose prose-invert max-w-none min-h-[60vh] px-4"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin({ imageUploadHandler }),
          tablePlugin(),
          codeBlockPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <ListsToggle />
                <CreateLink />
                <InsertImage />
                <InsertTable />
              </>
            ),
          }),
        ]}
      />
    );
  },
);
