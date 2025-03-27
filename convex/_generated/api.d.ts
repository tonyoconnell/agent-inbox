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
import type * as agents_private from "../agents/private.js";
import type * as agents_public from "../agents/public.js";
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
import type * as conversationMessages_private from "../conversationMessages/private.js";
import type * as conversationMessages_public from "../conversationMessages/public.js";
import type * as conversationParticipants_model from "../conversationParticipants/model.js";
import type * as conversationParticipants_private from "../conversationParticipants/private.js";
import type * as conversationParticipants_public from "../conversationParticipants/public.js";
import type * as conversations_model from "../conversations/model.js";
import type * as conversations_private from "../conversations/private.js";
import type * as conversations_public from "../conversations/public.js";
import type * as http from "../http.js";
import type * as users_model from "../users/model.js";
import type * as users_public from "../users/public.js";

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
  "agents/private": typeof agents_private;
  "agents/public": typeof agents_public;
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
  "conversationMessages/private": typeof conversationMessages_private;
  "conversationMessages/public": typeof conversationMessages_public;
  "conversationParticipants/model": typeof conversationParticipants_model;
  "conversationParticipants/private": typeof conversationParticipants_private;
  "conversationParticipants/public": typeof conversationParticipants_public;
  "conversations/model": typeof conversations_model;
  "conversations/private": typeof conversations_private;
  "conversations/public": typeof conversations_public;
  http: typeof http;
  "users/model": typeof users_model;
  "users/public": typeof users_public;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
