import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Skeleton } from "../../ui/skeleton";
import { Wrench, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Confirm } from "../../ui/confirm";
import { routes } from "../../../routes";
import { ThreadParticipants } from "./ThreadParticipants";

interface ThreadHeaderProps {
  thread: Doc<"threads"> | undefined | null;
}

export const ThreadHeader: React.FC<ThreadHeaderProps> = ({ thread }) => {
  const updateThread = useMutation(api.threads.updateMine);
  const deleteThread = useMutation(api.threads.removeMine);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(thread?.title ?? "");

  React.useEffect(() => {
    if (thread?.title) setNewTitle(thread.title);
  }, [thread?.title]);

  const handleSave = async () => {
    if (!thread?._id || !newTitle.trim()) return;

    await updateThread({
      threadId: thread?._id as Id<"threads">,
      title: newTitle.trim(),
    });
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (!thread?._id) return;

    await deleteThread({
      threadId: thread?._id as Id<"threads">,
    });
    setIsDeleteConfirmOpen(false);
    setIsOpen(false);
    routes.home().push();
  };

  return (
    <div className="h-14  flex items-center px-4 ">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="font-medium text-lg gap-2 bg-background"
          >
            {thread?._id && !thread ? (
              <Skeleton className="h-7 w-48" />
            ) : (
              <>
                {thread?.title}
                <Wrench className="h-4 w-4 opacity-20" />
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thread Settings</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Thread Name
            </label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter thread name"
            />
          </div>
          <DialogFooter className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setIsDeleteConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete Thread
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Confirm
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Thread"
        description={`Are you sure you want to delete "${thread?.title}"? This action cannot be undone.`}
        confirmText="Delete Thread"
        variant="destructive"
        onConfirm={handleDelete}
      />

      <ThreadParticipants thread={thread} />
    </div>
  );
};
