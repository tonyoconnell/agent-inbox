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
import type * as auth from "../auth.js";
import type * as conversationMessages_model from "../conversationMessages/model.js";
import type * as conversationMessages_private from "../conversationMessages/private.js";
import type * as conversationMessages_public from "../conversationMessages/public.js";
import type * as conversationParticipants_model from "../conversationParticipants/model.js";
import type * as conversationParticipants_public from "../conversationParticipants/public.js";
import type * as conversations_model from "../conversations/model.js";
import type * as conversations_private from "../conversations/private.js";
import type * as conversations_public from "../conversations/public.js";
import type * as http from "../http.js";
import type * as mastra_lib_storage from "../mastra/lib/storage.js";
import type * as mastra_lib_vector from "../mastra/lib/vector.js";
import type * as mastra_mastra from "../mastra/mastra.js";
import type * as mastra_tools from "../mastra/tools.js";
import type * as mastra_triage from "../mastra/triage.js";
import type * as mastra__ from "../mastra/_.js";
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
  auth: typeof auth;
  "conversationMessages/model": typeof conversationMessages_model;
  "conversationMessages/private": typeof conversationMessages_private;
  "conversationMessages/public": typeof conversationMessages_public;
  "conversationParticipants/model": typeof conversationParticipants_model;
  "conversationParticipants/public": typeof conversationParticipants_public;
  "conversations/model": typeof conversations_model;
  "conversations/private": typeof conversations_private;
  "conversations/public": typeof conversations_public;
  http: typeof http;
  "mastra/lib/storage": typeof mastra_lib_storage;
  "mastra/lib/vector": typeof mastra_lib_vector;
  "mastra/mastra": typeof mastra_mastra;
  "mastra/tools": typeof mastra_tools;
  "mastra/triage": typeof mastra_triage;
  "mastra/_": typeof mastra__;
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
