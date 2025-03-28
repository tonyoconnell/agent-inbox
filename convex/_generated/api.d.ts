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
import type * as agents_constants from "../agents/constants.js";
import type * as agents_model from "../agents/model.js";
import type * as agents_mutations from "../agents/mutations.js";
import type * as agents_private from "../agents/private.js";
import type * as agents_queries from "../agents/queries.js";
import type * as ai_agentReplyToMessage from "../ai/agentReplyToMessage.js";
import type * as ai_experiments from "../ai/experiments.js";
import type * as ai_history from "../ai/history.js";
import type * as ai_instructions from "../ai/instructions.js";
import type * as ai_messages from "../ai/messages.js";
import type * as ai_tools from "../ai/tools.js";
import type * as ai_triageMessage from "../ai/triageMessage.js";
import type * as ai_utils from "../ai/utils.js";
import type * as auth from "../auth.js";
import type * as conversationMessages_internalActions from "../conversationMessages/internalActions.js";
import type * as conversationMessages_model from "../conversationMessages/model.js";
import type * as conversationMessages_mutations from "../conversationMessages/mutations.js";
import type * as conversationMessages_private from "../conversationMessages/private.js";
import type * as conversationMessages_queries from "../conversationMessages/queries.js";
import type * as conversationParticipants_model from "../conversationParticipants/model.js";
import type * as conversationParticipants_mutations from "../conversationParticipants/mutations.js";
import type * as conversationParticipants_private from "../conversationParticipants/private.js";
import type * as conversationParticipants_queries from "../conversationParticipants/queries.js";
import type * as conversations_model from "../conversations/model.js";
import type * as conversations_mutations from "../conversations/mutations.js";
import type * as conversations_private from "../conversations/private.js";
import type * as conversations_queries from "../conversations/queries.js";
import type * as http from "../http.js";
import type * as users_model from "../users/model.js";
import type * as users_queries from "../users/queries.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "agents/constants": typeof agents_constants;
  "agents/model": typeof agents_model;
  "agents/mutations": typeof agents_mutations;
  "agents/private": typeof agents_private;
  "agents/queries": typeof agents_queries;
  "ai/agentReplyToMessage": typeof ai_agentReplyToMessage;
  "ai/experiments": typeof ai_experiments;
  "ai/history": typeof ai_history;
  "ai/instructions": typeof ai_instructions;
  "ai/messages": typeof ai_messages;
  "ai/tools": typeof ai_tools;
  "ai/triageMessage": typeof ai_triageMessage;
  "ai/utils": typeof ai_utils;
  auth: typeof auth;
  "conversationMessages/internalActions": typeof conversationMessages_internalActions;
  "conversationMessages/model": typeof conversationMessages_model;
  "conversationMessages/mutations": typeof conversationMessages_mutations;
  "conversationMessages/private": typeof conversationMessages_private;
  "conversationMessages/queries": typeof conversationMessages_queries;
  "conversationParticipants/model": typeof conversationParticipants_model;
  "conversationParticipants/mutations": typeof conversationParticipants_mutations;
  "conversationParticipants/private": typeof conversationParticipants_private;
  "conversationParticipants/queries": typeof conversationParticipants_queries;
  "conversations/model": typeof conversations_model;
  "conversations/mutations": typeof conversations_mutations;
  "conversations/private": typeof conversations_private;
  "conversations/queries": typeof conversations_queries;
  http: typeof http;
  "users/model": typeof users_model;
  "users/queries": typeof users_queries;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
