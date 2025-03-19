import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import { AvatarCircles } from "../../magicui/avatar-circles";

interface ThreadParticipantsProps {
  thread: Doc<"threads"> | undefined | null;
}

export const ThreadParticipants: React.FC<ThreadParticipantsProps> = ({
  thread,
}) => {
  const avatars = useQuery(api.threadParticipants.listAvatars, {
    threadId: thread?._id!,
  });

  return (
    <>
      <AvatarCircles
        className="ml-auto"
        numPeople={0}
        avatarUrls={
          avatars?.map((p) => ({
            imageUrl: p,
            profileUrl: "#",
          })) ?? []
        }
      />
    </>
  );
};
