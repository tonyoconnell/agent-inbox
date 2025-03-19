import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { useState } from "react";
import { Input } from "./ui/input";

export const ThreadList = () => {
  const threads = useQuery(api.threads.list);
  const createThread = useMutation(api.threads.create);
  const [newThreadTitle, setNewThreadTitle] = useState("");

  if (!threads) return <div>Loading...</div>;

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim()) return;
    await createThread({ title: newThreadTitle });
    setNewThreadTitle("");
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Input
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
          placeholder="New thread title..."
          onKeyDown={(e) => e.key === "Enter" && handleCreateThread()}
        />
        <Button onClick={handleCreateThread}>Create Thread</Button>
      </div>

      <div className="flex flex-col gap-2">
        {threads.map((thread) => (
          <div
            key={thread._id}
            className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 cursor-pointer"
          >
            {thread.title}
          </div>
        ))}
      </div>
    </div>
  );
};
