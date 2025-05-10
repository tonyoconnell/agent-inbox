import { createRouter, defineRoute, param } from "type-route";

export const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute("/"),
  conversation: defineRoute(
    {
      conversationId: param.path.string,
    },
    (p) => `/conversation/${p.conversationId}`,
  ),
  agent: defineRoute(
    {
      agentId: param.path.string,
    },
    (p) => `/agent/${p.agentId}`,
  ),
  profile: defineRoute("/profile"),
  tools: defineRoute("/tools"),
});

export type ConversationParams = {
  conversationId: string;
  taskId?: string;
};

// Helper to get current conversation ID if we're on a conversation route
export function useCurrentConversationId(): string | undefined {
  const route = useRoute();
  if (route.name === "conversation") return route.params.conversationId;
  return undefined;
}

export function useCurrentAgentId() {
  const route = useRoute();
  if (route.name === "agent") return route.params.agentId;
  return undefined;
}

export function useToolsRoute() {
  const route = useRoute();
  return route.name === "tools";
}
