import * as React from "react";

export const TextEditor: React.FC = () => (
  <div className="w-full h-full p-4 bg-white rounded-lg shadow-sm">
    <textarea
      className="w-full h-full min-h-[600px] p-4 border-0 focus:outline-none resize-none"
      placeholder="Start writing..."
    />
  </div>
);
