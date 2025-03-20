import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { UserPlus, Trash2 } from "lucide-react";

interface ParticipantsDialogProps {
  conversation: Doc<"conversations">;
  trigger: React.ReactNode;
}

export const ParticipantsDialog: React.FC<ParticipantsDialogProps> = ({
  conversation,
  trigger,
}) => {
  const participants = useQuery(api.conversationParticipants.listDetails, {
    conversationId: conversation._id,
  });

  const removeParticipant = useMutation(
    api.conversationParticipants.removeParticipant,
  );

  const handleRemove = async (
    participantId: Id<"conversationParticipants">,
  ) => {
    await removeParticipant({
      conversationId: conversation._id,
      participantId,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Conversation Participants</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            {participants?.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={p.avatarUrl} />
                    <AvatarFallback>{p.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{p.name}</div>
                    {p.kind === "agent" && (
                      <div className="text-sm text-muted-foreground">
                        {p.description}
                      </div>
                    )}
                    {p.isCreator && (
                      <div className="text-xs text-muted-foreground">
                        Creator
                      </div>
                    )}
                  </div>
                </div>
                {!p.isCreator && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(p.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button className="w-full" variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Participant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
