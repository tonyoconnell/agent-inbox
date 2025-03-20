/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as agents from "../agents.js";
import type * as auth from "../auth.js";
import type * as conversationMessages from "../conversationMessages.js";
import type * as conversationParticipants from "../conversationParticipants.js";
import type * as conversations from "../conversations.js";
import type * as http from "../http.js";
import type * as mastra_mastraMock from "../mastra/mastraMock.js";
import type * as mastra__ from "../mastra/_.js";
import type * as model_agents from "../model/agents.js";
import type * as model_conversationParticipants from "../model/conversationParticipants.js";
import type * as model_conversations from "../model/conversations.js";
import type * as model_messages from "../model/messages.js";
import type * as model_predefinedAgents from "../model/predefinedAgents.js";
import type * as model_users from "../model/users.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  agents: typeof agents;
  auth: typeof auth;
  conversationMessages: typeof conversationMessages;
  conversationParticipants: typeof conversationParticipants;
  conversations: typeof conversations;
  http: typeof http;
  "mastra/mastraMock": typeof mastra_mastraMock;
  "mastra/_": typeof mastra__;
  "model/agents": typeof model_agents;
  "model/conversationParticipants": typeof model_conversationParticipants;
  "model/conversations": typeof model_conversations;
  "model/messages": typeof model_messages;
  "model/predefinedAgents": typeof model_predefinedAgents;
  "model/users": typeof model_users;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
