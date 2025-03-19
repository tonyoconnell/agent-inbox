import { components } from "./_generated/api";
import { ProsemirrorSync } from "@convex-dev/prosemirror-sync";
import { query, mutation } from "./_generated/server";
import * as Docs from "./model/documents";

const prosemirrorSync = new ProsemirrorSync(components.prosemirrorSync);

export const {
  getSnapshot,
  submitSnapshot,
  latestVersion,
  getSteps,
  submitSteps,
} = prosemirrorSync.syncApi({});

export const getMyMainDocument = query({
  handler: Docs.findMyMainDocument,
});

export const createMyMainDocument = mutation({
  handler: Docs.createMyMainDocument,
});
