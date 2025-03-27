import { test, expect, describe } from "vitest";
import { Id } from "../convex/_generated/dataModel";
import {
  parseMentionsFromMessageContent,
  splitMessageContent,
  createMentionString,
} from "./mentions";

describe("parseReferencesFromMessageContent", () => {
  test("should return empty array when no references are present", () => {
    const content = "Hello world, this is a message with no references";
    const result = parseMentionsFromMessageContent(content);
    expect(result).toEqual([]);
  });

  test("should parse a single agent reference", () => {
    const agentId = "abc123" as Id<"agents">;
    const content = `Hello @[Agent Smith](agent:${agentId}), how are you?`;

    const result = parseMentionsFromMessageContent(content);

    expect(result).toEqual([
      {
        kind: "agent",
        agentId,
        display: "Agent Smith",
      },
    ]);
  });

  test("should parse multiple agent references", () => {
    const agentId1 = "abc123" as Id<"agents">;
    const agentId2 = "def456" as Id<"agents">;
    const content = `Hello @[Agent Smith](agent:${agentId1}), can you talk to @[Agent Johnson](agent:${agentId2})?`;

    const result = parseMentionsFromMessageContent(content);

    expect(result).toEqual([
      {
        kind: "agent",
        agentId: agentId1,
        display: "Agent Smith",
      },
      {
        kind: "agent",
        agentId: agentId2,
        display: "Agent Johnson",
      },
    ]);
  });

  test("should handle references with special characters in name", () => {
    const agentId = "abc123" as Id<"agents">;
    const content = `Hello @[Agent Smith-Jones (AI)](agent:${agentId})`;

    const result = parseMentionsFromMessageContent(content);

    expect(result).toEqual([
      {
        kind: "agent",
        agentId,
        display: "Agent Smith-Jones (AI)",
      },
    ]);
  });

  test("should handle references at beginning, middle and end of content", () => {
    const agentId1 = "abc123" as Id<"agents">;
    const agentId2 = "def456" as Id<"agents">;
    const agentId3 = "ghi789" as Id<"agents">;

    const content = `@[First](agent:${agentId1}) is at the beginning, @[Second](agent:${agentId2}) is in the middle, and @[Third](agent:${agentId3})`;

    const result = parseMentionsFromMessageContent(content);

    expect(result).toEqual([
      { kind: "agent", agentId: agentId1, display: "First" },
      { kind: "agent", agentId: agentId2, display: "Second" },
      { kind: "agent", agentId: agentId3, display: "Third" },
    ]);
  });

  test("should parse a single user reference", () => {
    const userId = "xyz789" as Id<"users">;
    const content = `Hello @[John](user:${userId}), how are you?`;

    const result = parseMentionsFromMessageContent(content);

    expect(result).toEqual([
      {
        kind: "user",
        userId,
        display: "John",
      },
    ]);
  });

  test("should parse mixed agent and user references", () => {
    const agentId = "abc123" as Id<"agents">;
    const userId = "xyz789" as Id<"users">;
    const content = `@[Agent Smith](agent:${agentId}) please help @[John](user:${userId}) with their request`;

    const result = parseMentionsFromMessageContent(content);

    expect(result).toEqual([
      {
        kind: "agent",
        agentId,
        display: "Agent Smith",
      },
      {
        kind: "user",
        userId,
        display: "John",
      },
    ]);
  });
});

describe("splitMessageContent", () => {
  test("should return single text part when no mentions exist", () => {
    const content = "Hello world, this is a message with no mentions";
    const result = splitMessageContent(content);
    expect(result).toEqual([
      {
        type: "text",
        content: "Hello world, this is a message with no mentions",
      },
    ]);
  });

  test("should split content with a single mention", () => {
    const agentId = "abc123" as Id<"agents">;
    const content = `Hello @[Agent Smith](agent:${agentId}), how are you?`;

    const result = splitMessageContent(content);

    expect(result).toEqual([
      {
        type: "text",
        content: "Hello ",
      },
      {
        type: "mention",
        content: `@[Agent Smith](agent:${agentId})`,
        reference: {
          kind: "agent",
          agentId,
          display: "Agent Smith",
        },
      },
      {
        type: "text",
        content: ", how are you?",
      },
    ]);
  });

  test("should handle multiple mentions with text between", () => {
    const agentId = "abc123" as Id<"agents">;
    const userId = "xyz789" as Id<"users">;
    const content = `@[Agent Smith](agent:${agentId}) please help @[John](user:${userId}) with their request`;

    const result = splitMessageContent(content);

    expect(result).toEqual([
      {
        type: "mention",
        content: `@[Agent Smith](agent:${agentId})`,
        reference: {
          kind: "agent",
          agentId,
          display: "Agent Smith",
        },
      },
      {
        type: "text",
        content: " please help ",
      },
      {
        type: "mention",
        content: `@[John](user:${userId})`,
        reference: {
          kind: "user",
          userId,
          display: "John",
        },
      },
      {
        type: "text",
        content: " with their request",
      },
    ]);
  });

  test("should handle adjacent mentions without text between", () => {
    const agentId1 = "abc123" as Id<"agents">;
    const agentId2 = "def456" as Id<"agents">;
    const content = `@[Agent1](agent:${agentId1})@[Agent2](agent:${agentId2})`;

    const result = splitMessageContent(content);

    expect(result).toEqual([
      {
        type: "mention",
        content: `@[Agent1](agent:${agentId1})`,
        reference: {
          kind: "agent",
          agentId: agentId1,
          display: "Agent1",
        },
      },
      {
        type: "mention",
        content: `@[Agent2](agent:${agentId2})`,
        reference: {
          kind: "agent",
          agentId: agentId2,
          display: "Agent2",
        },
      },
    ]);
  });
});

describe("createMentionString", () => {
  test("should create agent mention string", () => {
    const agentId = "abc123" as Id<"agents">;
    const reference = {
      kind: "agent" as const,
      agentId,
      name: "Agent Smith",
    };

    const result = createMentionString(reference);
    expect(result).toBe(`@[Agent Smith](agent:${agentId})`);

    // Verify the generated string can be parsed back correctly
    const parsed = parseMentionsFromMessageContent(result);
    expect(parsed).toEqual([
      {
        kind: "agent",
        agentId,
        display: "Agent Smith",
      },
    ]);
  });

  test("should create user mention string", () => {
    const userId = "xyz789" as Id<"users">;
    const reference = {
      kind: "user" as const,
      userId,
      name: "John Doe",
    };

    const result = createMentionString(reference);
    expect(result).toBe(`@[John Doe](user:${userId})`);

    // Verify the generated string can be parsed back correctly
    const parsed = parseMentionsFromMessageContent(result);
    expect(parsed).toEqual([
      {
        kind: "user",
        userId,
        display: "John Doe",
      },
    ]);
  });

  test("should handle special characters in names", () => {
    const agentId = "abc123" as Id<"agents">;
    const reference = {
      kind: "agent" as const,
      agentId,
      name: "Agent Smith-Jones (AI)",
    };

    const result = createMentionString(reference);
    expect(result).toBe(`@[Agent Smith-Jones (AI)](agent:${agentId})`);

    // Verify the generated string can be parsed back correctly
    const parsed = parseMentionsFromMessageContent(result);
    expect(parsed).toEqual([
      {
        kind: "agent",
        agentId,
        display: "Agent Smith-Jones (AI)",
      },
    ]);
  });
});
