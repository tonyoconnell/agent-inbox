import * as React from "react";
import { Doc } from "convex/_generated/dataModel";

interface Props {
  message: Doc<"conversationMessages">;
}

export const SystemMessage: React.FC<Props> = ({ message }) => {
  if (message.kind != "system")
    throw new Error("Message is not a system message");

  return <div>hello SystemMessage</div>;
};
