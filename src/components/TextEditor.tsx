import * as React from "react";

export const TextEditor: React.FC = () => (
  <div className="w-full h-full p-4 bg-white rounded-lg shadow-sm border border-pastel-200">
    <textarea
      className="w-full h-full min-h-[600px] p-4 border-0 focus:outline-none focus:ring-1 focus:ring-primary resize-none text-foreground placeholder:text-muted-foreground"
      placeholder="Start writing..."
    />
  </div>
);
