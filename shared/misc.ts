import { Id } from "../convex/_generated/dataModel";

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const ret: any = {};
  keys.forEach((key) => {
    ret[key] = obj[key];
  });
  return ret;
}

export function exhaustiveCheck(param: never): never {
  throw new Error(`Exhaustive check failed: ${param}`);
}

export function wait(ms: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

export const iife = <T>(fn: () => T): T => fn();

export type MessageReference =
  | { kind: "agent"; agentId: Id<"agents">; display: string }
  | { kind: "user"; userId: Id<"users">; display: string };

export type AgentTool = {
  name: string;
  description: string;
  parameters: Record<
    string,
    {
      type: string;
      description: string;
      required?: boolean;
    }
  >;
};

export const AVAILABLE_TOOLS = {
  listConversationParticipants: {
    name: "listConversationParticipants",
    description: "A tool for listing the participants in a conversation.",
    parameters: {
      conversationId: {
        type: "string",
        description: "The ID of the conversation to list participants for",
        required: true,
      },
    },
  },
  listAgents: {
    name: "listAgents",
    description: "Allows listing of all of a user's agents",
    parameters: {
      userId: {
        type: "string",
        description: "The ID of the user whose agents to list",
        required: true,
      },
    },
  },
  messageAnotherAgent: {
    name: "messageAnotherAgent",
    description: "Allows sending of a message to another agent",
    parameters: {
      target: {
        type: "object",
        description: "The target agent to message",
        required: true,
      },
      content: {
        type: "string",
        description: "The message content to send",
        required: true,
      },
    },
  },
  noOutput: {
    name: "noOutput",
    description: "Use this tool if you dont want to return any output",
    parameters: {
      reasoning: {
        type: "string",
        description: "The reason for not returning output",
        required: true,
      },
    },
  },
  webSearch: {
    name: "webSearch",
    description: "Use this tool to search the web for information",
    parameters: {
      query: {
        type: "string",
        description: "The search query to execute",
        required: true,
      },
    },
  },
  scheduleTask: {
    name: "scheduleTask",
    description: "Allows scheduling of a task to be completed at a later time.",
    parameters: {
      target: {
        type: "object",
        description: "The target agent for the scheduled task",
        required: true,
      },
      title: {
        type: "string",
        description: "The title of the scheduled task",
        required: true,
      },
      content: {
        type: "string",
        description: "The content of the scheduled task",
        required: true,
      },
      secondsFromNow: {
        type: "number",
        description: "When to schedule the task for (in seconds from now)",
        required: true,
      },
    },
  },
} as const;

export type AvailableToolName = keyof typeof AVAILABLE_TOOLS;
