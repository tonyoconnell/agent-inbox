import * as React from "react";
import { TextEditor } from "./TextEditor";
import { AgentPanel } from "./AgentPanel";

export const Content: React.FC = () => (
  <div className="flex gap-6 h-screen max-h-[calc(100vh-200px)]">
    <div className="flex-1">
      <TextEditor />
    </div>
    <div className="w-96">
      <AgentPanel />
    </div>
  </div>
);
