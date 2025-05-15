import * as React from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../convex/_generated/api";
import { useApiErrorHandler } from "../../misc/errors";
import { Id } from "../../../../convex/_generated/dataModel";
import { EditableText } from "../../ui/editable-text";

export type Task = {
  _id: Id<"tasks">;
  title: string;
  description?: string;
  status?: string;
  dueDate?: number;
  priority?: string;
  createdAt: number;
  updatedAt?: number;
  completedAt?: number;
};

const DEFAULT_TASK_TITLE = "New Task";

export const TaskList = () => {
  const tasks = useQuery(api.tasks.queries.listMine);
  const createTask = useMutation(api.tasks.mutations.create);
  const updateTask = useMutation(api.tasks.mutations.update);
  const removeTask = useMutation(api.tasks.mutations.remove);
  const onApiError = useApiErrorHandler();
  const [search, setSearch] = React.useState("");

  const filteredTasks = React.useMemo(() => {
    if (!tasks) return [];
    const s = search.trim().toLowerCase();
    if (!s) return tasks;
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(s) ||
        (t.description?.toLowerCase().includes(s) ?? false)
    );
  }, [tasks, search]);

  const handleCreate = () => {
    createTask({ title: DEFAULT_TASK_TITLE })
      .then(() => setSearch(""))
      .catch(onApiError);
  };

  return (
    <>
      <div className="p-4">
        <Button
          className="w-full"
          variant="default"
          onClick={handleCreate}
        >
          New Task
        </Button>
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-3"
        />
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {filteredTasks?.map((task) => (
          <Card key={task._id} className="flex items-center gap-3 p-3">
            <input
              type="checkbox"
              checked={task.status === "done"}
              onChange={() => {
                updateTask({ taskId: task._id, status: task.status === "done" ? "todo" : "done" })
                  .catch(onApiError);
              }}
              className="mr-2"
            />
            <EditableText
              value={task.title}
              onSave={async (value) => {
                await updateTask({ taskId: task._id, title: value }).catch(onApiError);
              }}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                removeTask({ taskId: task._id }).catch(onApiError);
              }}
              aria-label="Delete task"
            >
              🗑️
            </Button>
          </Card>
        ))}
        {filteredTasks && filteredTasks.length === 0 && (
          <div className="text-muted-foreground text-sm text-center py-4">
            No tasks yet.
          </div>
        )}
      </div>
    </>
  );
}; 