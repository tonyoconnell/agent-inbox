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
      flex items-center gap-3 p-3 rounded-lg cursor-pointer
      ${isRaisingHand ? "bg-blue-50 dark:bg-blue-900" : "bg-gray-50 dark:bg-gray-800"}
    `}
    onClick={onClick}
  >
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
      {avatar ? (
        <img src={avatar} alt={name} className="w-full h-full rounded-full" />
      ) : (
        <span className="text-lg">{name[0]}</span>
      )}
    </div>
    <div className="flex-1">
      <h3 className="font-medium">{name}</h3>
      {isRaisingHand && (
        <span className="text-sm text-blue-500">Has something to say...</span>
      )}
    </div>
  </div>
);
