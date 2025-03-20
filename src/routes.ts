import { createRouter, defineRoute, param } from "type-route";

export const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute("/"),
  thread: defineRoute(
    {
      threadId: param.path.string,
    },
    (p) => `/thread/${p.threadId}`,
  ),
  threadWithTask: defineRoute(
    {
      threadId: param.path.string,
      taskId: param.path.string,
    },
    (p) => `/thread/${p.threadId}/task/${p.taskId}`,
  ),
  agent: defineRoute(
    {
      agentId: param.path.string,
    },
    (p) => `/agent/${p.agentId}`,
  ),
});

export type ThreadParams = {
  threadId: string;
  taskId?: string;
};

// Helper to get current thread ID if we're on a thread route
export function useCurrentThreadId(): string | undefined {
  const route = useRoute();
  if (route.name === "thread" || route.name === "threadWithTask")
    return route.params.threadId;
  return undefined;
}

// Helper to get current task ID if we're on a task route
export function useCurrentTaskId(): string | undefined {
  const route = useRoute();
  if (route.name === "threadWithTask") return route.params.taskId;
  return undefined;
}

export function useCurrentAgentId() {
  const route = useRoute();
  if (route.name === "agent") return route.params.agentId;
  return undefined;
}
