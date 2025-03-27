import { internalAction } from "../_generated/server";
import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import { v } from "convex/values";
import { z } from "zod";

export const experiment_triageTools = internalAction({
  args: {
    messageContent: v.string(),
    fromUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const triageAgent = {
      _id: "hh43tyfgs",
      name: "Triage Agent",
      description:
        "A helpful system agent that can help with triaging conversations.",
    };

    const result = await generateText({
      model: openai("gpt-4o-mini"),
      maxSteps: 5,
      system: `You are a helpful agent that triages conversations.
  
You will be given a conversation message and its up to you to determine what agent you should route this message to.

YOU SHOULD NOT RESPOND TO THE QUERY DIRECTLY, ONLY TRIAGE THE MESSAGE.

You can use the tools to find out who the participants in the conversation are.

If there are no agent provided then you should send a message to the channel along the lines of "No agents available to handle this message, would you like me to see if there are any agents you have that might be suited?".

You reference an agent in a message content string but using the following special syntax: @[AGENT_NAME](agent:AGENT_ID) so for example @[John](agent:abc123)

If there is an agent that can handle the message then you should respond in a casual friendly manner. "Hey @[AGENT_NAME](agent:abc123) can you take a look at this?" or "Hey @[AGENT_NAME](agent:abc123) this seems like its a good one for you" feel free to be creative.

Here is some extra info about you the agent:
${JSON.stringify(triageAgent, null, 2)}

Here is some other info about the message:
${JSON.stringify(args, null, 2)}

}`,
      messages: [
        {
          role: "user",
          content: args.messageContent,
        },
      ],
      tools: {
        listConversationParticipants: tool({
          description: "A tool for listing the participants in a conversation.",
          parameters: z.object({
            conversationId: z.string(),
          }),
          execute: async ({ conversationId }) => {
            console.log(`calling listConversationParticipants tool`, {
              conversationId,
            });
            return [
              {
                _id: "345hsdfh",
                kind: "user",
                user: {
                  _id: args.fromUserId,
                  name: "John",
                },
              },
              {
                _id: "345hsdfh",
                kind: "agent",
                agent: {
                  _id: "hh43tyfgs",
                  name: "Triage Agent",
                  description:
                    "A helpful system agent that can help with triaging conversations.",
                },
              },
            ];
          },
        }),

        listUserAgents: tool({
          description: "A tool for listing the user's agents.",
          parameters: z.object({
            userId: z.string(),
          }),
          execute: async ({ userId }) => {
            console.log(`calling listUserAgents tool`, { userId });
            return [
              {
                _id: "abc123",
                name: "DaveBot",
                description:
                  "A helpful agent that can help with general queries.",
                personality: "Friendly and helpful.",
                tools: [],
                participantId: "abc123",
              },
              {
                _id: "abc123",
                name: "TweetBot",
                description: "An agent dedicated to building tweets",
                personality: "Friendly and helpful.",
                tools: [],
                participantId: "abc123",
              },
            ];
          },
        }),

        // sendMessageToChannel: tool({
        //   description: "A tool for sending a message to a channel.",
        //   parameters: z.object({
        //     messageContent: z.string(),
        //     channelId: z.string(),
        //   }),
        //   execute: async ({ messageContent, channelId }) => {
        //     console.log(`calling sendMessageToChannel tool`, {
        //       messageContent,
        //       channelId,
        //     });
        //     return {
        //       sentMessageId: `${Math.random()}`,
        //     };
        //   },
        // }),
      },
    });

    console.log(`FINAL TOOL CALLS:`);
    console.log(JSON.stringify(result.toolCalls, null, 2));

    console.log(`FINAL RESULT:`);
    console.log(JSON.stringify(result));

    return result.text;
  },
});
