import * as React from "react";
import { useBlockNoteSync } from "@convex-dev/prosemirror-sync/blocknote";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { api } from "../../convex/_generated/api";

export const TextEditor: React.FC = () => {
  const sync = useBlockNoteSync(api.documents, "test", { debug: true });

  if (!sync.isLoading && !sync.editor)
    sync.create({ type: "doc", content: [] });

  return sync.isLoading ? (
    <p>Loading...</p>
  ) : sync.editor ? (
    <BlockNoteView editor={sync.editor} theme={"light"} />
  ) : (
    <button onClick={() => sync.create({ type: "doc", content: [] })}>
      Create document
    </button>
  );
};
