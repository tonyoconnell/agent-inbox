import { test, expect, describe } from "vitest";
import { parseReferencesFromMessageContent } from "./model";
import { Id } from "../_generated/dataModel";

describe("parseReferencesFromMessageContent", () => {
  test("should return empty array when no references are present", () => {
    const content = "Hello world, this is a message with no references";
    const result = parseReferencesFromMessageContent(content);
    expect(result).toEqual([]);
  });

  test("should parse a single agent reference", () => {
    const agentId = "abc123" as Id<"agents">;
    const content = `Hello @[Agent Smith](agent:${agentId}), how are you?`;

    const result = parseReferencesFromMessageContent(content);

    expect(result).toEqual([
      {
        kind: "agent",
        agentId,
      },
    ]);
  });

  test("should parse multiple agent references", () => {
    const agentId1 = "abc123" as Id<"agents">;
    const agentId2 = "def456" as Id<"agents">;
    const content = `Hello @[Agent Smith](agent:${agentId1}), can you talk to @[Agent Johnson](agent:${agentId2})?`;

    const result = parseReferencesFromMessageContent(content);

    expect(result).toEqual([
      {
        kind: "agent",
        agentId: agentId1,
      },
      {
        kind: "agent",
        agentId: agentId2,
      },
    ]);
  });

  test("should ignore non-agent references", () => {
    const agentId = "abc123" as Id<"agents">;
    const content = `Hello @[Agent Smith](agent:${agentId}) and @[John](user:xyz789)`;

    const result = parseReferencesFromMessageContent(content);

    expect(result).toEqual([
      {
        kind: "agent",
        agentId,
      },
    ]);
  });

  test("should handle references with special characters in name", () => {
    const agentId = "abc123" as Id<"agents">;
    const content = `Hello @[Agent Smith-Jones (AI)](agent:${agentId})`;

    const result = parseReferencesFromMessageContent(content);

    expect(result).toEqual([
      {
        kind: "agent",
        agentId,
      },
    ]);
  });

  test("should handle references at beginning, middle and end of content", () => {
    const agentId1 = "abc123" as Id<"agents">;
    const agentId2 = "def456" as Id<"agents">;
    const agentId3 = "ghi789" as Id<"agents">;

    const content = `@[First](agent:${agentId1}) is at the beginning, @[Second](agent:${agentId2}) is in the middle, and @[Third](agent:${agentId3})`;

    const result = parseReferencesFromMessageContent(content);

    expect(result).toEqual([
      { kind: "agent", agentId: agentId1 },
      { kind: "agent", agentId: agentId2 },
      { kind: "agent", agentId: agentId3 },
    ]);
  });
});
