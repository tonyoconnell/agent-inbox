import * as React from "react";
import { TextEditor } from "./TextEditor";
import { AgentPanel } from "./AgentPanel";
import { api } from "../../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Doc } from "convex/_generated/dataModel";

export const Content: React.FC<{ me: Doc<"users"> }> = ({ me }) => {
  const mainDoc = useQuery(api.documents.getMyMainDocument);
  const createMainDoc = useMutation(api.documents.createMyMainDocument);

  React.useEffect(() => {
    if (mainDoc === undefined) return; // its loading
    if (!mainDoc) createMainDoc();
  }, [mainDoc]);

  return (
    <div className="flex gap-6 h-screen max-h-[calc(100vh-200px)]">
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-border py-6 ">
        {mainDoc ? <TextEditor docId={mainDoc._id} /> : "loading.."}
      </div>
      <div className="w-96">
        <AgentPanel />
      </div>
    </div>
  );
};
