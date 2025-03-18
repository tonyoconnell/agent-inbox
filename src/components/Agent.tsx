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
          ? "bg-accent hover:bg-accent/90"
          : "bg-card hover:bg-accent/50"
      }
    `}
    onClick={onClick}
  >
    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
      {avatar ? (
        <img src={avatar} alt={name} className="w-full h-full rounded-full" />
      ) : (
        <span className="text-lg font-medium">{name[0]}</span>
      )}
    </div>
    <div className="flex-1">
      <h3 className="font-medium text-foreground">{name}</h3>
      {isRaisingHand && (
        <span className="text-sm text-muted-foreground">
          Has something to say...
        </span>
      )}
    </div>
  </div>
);
