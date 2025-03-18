import * as React from "react";

export interface AgentProps {
  name: string;
  isRaisingHand: boolean;
  avatar?: string;
  onClick?: () => void;
}

export const Agent: React.FC<AgentProps> = ({
  name,
  isRaisingHand,
  avatar,
  onClick,
}) => (
  <div
    className={`
      flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
      ${
        isRaisingHand
          ? "bg-pastel-100 hover:bg-pastel-200"
          : "bg-white hover:bg-pastel-50"
      }
    `}
    onClick={onClick}
  >
    <div className="w-10 h-10 rounded-full bg-pastel-200 flex items-center justify-center text-pastel-700">
      {avatar ? (
        <img src={avatar} alt={name} className="w-full h-full rounded-full" />
      ) : (
        <span className="text-lg font-medium">{name[0]}</span>
      )}
    </div>
    <div className="flex-1">
      <h3 className="font-medium text-pastel-900">{name}</h3>
      {isRaisingHand && (
        <span className="text-sm text-pastel-600">Has something to say...</span>
      )}
    </div>
  </div>
);
