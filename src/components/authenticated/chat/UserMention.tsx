import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { BaseMention } from "./BaseMention";

interface UserMentionProps {
  display: string;
  userId: Id<"users">;
  isInUserMessage?: boolean;
}

export const UserMention: React.FC<UserMentionProps> = ({
  display,
  userId,
  isInUserMessage,
}) => {
  const user = useQuery(api.users.public.findMention, { userId });
  if (!user) return null;

  return (
    <BaseMention
      display={display}
      isInUserMessage={isInUserMessage}
      avatar={
        <Avatar className="h-4 w-4 translate-y-[1px]">
          <AvatarImage src={user.image} />
          <AvatarFallback>{display[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      }
    />
  );
};
