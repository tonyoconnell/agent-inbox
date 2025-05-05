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
    className={`rounded-xl border mb-3 px-5 py-4 cursor-pointer transition-all duration-150 shadow-sm border-[#2d2d36] hover:bg-[#282832] hover:shadow-md ${isSelected ? "border-[#23232a]" : "bg-[#23232a]"}`}
    style={isSelected ? { background: "hsla(var(--one-muted), 0.08)" } : {}}
  >
    <div className="font-semibold text-white text-base mb-1">{title}</div>
    <div className="text-xs text-gray-400 mb-1">{new Date(lastMessageTime).toLocaleTimeString()}</div>
    {/* Optionally add a preview/summary here if available */}
    {/* <div className="text-sm text-gray-300 mb-2">Preview text here...</div> */}
    {/* Optionally add tags here if available */}
    {/* <div className="flex gap-2 mb-1">
      <span className="rounded-full bg-[#18181b] border border-[#23232a] px-3 py-1 text-xs font-medium text-gray-300">Tag</span>
    </div> */}
  </div>
);
