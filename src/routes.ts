import { createRouter, defineRoute, param } from "type-route";

export const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute("/"),
  conversation: defineRoute(
    {
      conversationId: param.path.string,
    },
    (p) => `/conversation/${p.conversationId}`,
  ),
  conversationWithTask: defineRoute(
    {
      conversationId: param.path.string,
      taskId: param.path.string,
    },
    (p) => `/conversation/${p.conversationId}/task/${p.taskId}`,
  ),
  agent: defineRoute(
    {
      agentId: param.path.string,
    },
    (p) => `/agent/${p.agentId}`,
  ),
});

export type ConversationParams = {
  conversationId: string;
  taskId?: string;
};

// Helper to get current conversation ID if we're on a conversation route
export function useCurrentConversationId(): string | undefined {
  const route = useRoute();
  if (route.name === "conversation" || route.name === "conversationWithTask")
    return route.params.conversationId;
  return undefined;
}

// Helper to get current task ID if we're on a task route
export function useCurrentTaskId(): string | undefined {
  const route = useRoute();
  if (route.name === "conversationWithTask") return route.params.taskId;
  return undefined;
}

export function useCurrentAgentId() {
  const route = useRoute();
  if (route.name === "agent") return route.params.agentId;
  return undefined;
}
