import * as React from "react";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";

export const TextEditor: React.FC = () => (
  <Card className="w-full h-full p-4">
    <Textarea
      className="w-full h-full min-h-[600px] p-4 border-0 focus-visible:ring-1 resize-none"
      placeholder="Start writing..."
    />
  </Card>
);
