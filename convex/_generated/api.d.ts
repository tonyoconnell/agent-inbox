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
import type * as http from "../http.js";
import type * as model_agents from "../model/agents.js";
import type * as model_threadParticipants from "../model/threadParticipants.js";
import type * as model_threads from "../model/threads.js";
import type * as model_users from "../model/users.js";
import type * as threadParticipants from "../threadParticipants.js";
import type * as threads from "../threads.js";
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
  http: typeof http;
  "model/agents": typeof model_agents;
  "model/threadParticipants": typeof model_threadParticipants;
  "model/threads": typeof model_threads;
  "model/users": typeof model_users;
  threadParticipants: typeof threadParticipants;
  threads: typeof threads;
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
