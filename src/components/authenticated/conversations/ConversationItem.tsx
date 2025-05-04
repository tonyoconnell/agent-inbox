import * as React from "react";

interface ConversationItemProps {
  id: string;
  title: string;
  lastMessageTime: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  id,
  title,
  lastMessageTime,
  isSelected,
  onSelect,
}) => (
  <div
    onClick={() => onSelect(id)}
    className={`bg-white rounded-xl border mb-3 px-5 py-4 cursor-pointer transition-all duration-150 shadow-sm border-gray-200 hover:bg-gray-50 hover:shadow-md
      ${isSelected ? "border-blue-600 ring-2 ring-blue-600" : ""}`}
  >
    <div className="font-semibold text-gray-900 text-base mb-1">{title}</div>
    <div className="text-xs text-gray-500 mb-1">{new Date(lastMessageTime).toLocaleTimeString()}</div>
    {/* Optionally add a preview/summary here if available */}
    {/* <div className="text-sm text-gray-700 mb-2">Preview text here...</div> */}
    {/* Optionally add tags here if available */}
    {/* <div className="flex gap-2 mb-1">
      <span className="rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700">Tag</span>
    </div> */}
  </div>
);
