import * as React from "react";
import { TextEditor } from "./TextEditor";
import { AgentPanel } from "./AgentPanel";

export const Content: React.FC = () => (
  <div className="flex gap-4 h-screen max-h-[calc(100vh-200px)]">
    <div className="flex-1">
      <TextEditor />
    </div>
    <div className="w-80">
      <AgentPanel />
    </div>
  </div>
);
