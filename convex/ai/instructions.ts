import { Doc } from "../_generated/dataModel";
import { ParticipantUserOrAgent } from "../conversationParticipants/model";
import { MessageHistory } from "./history";

const referenceAgentInstructions = `You can reference an agent in your output using the following special syntax: 
@[AGENT_NAME](agent:AGENT_ID) 
so for example:
"Hey @[John](agent:abc123) can you take a look at this?"

A referenced agent will then pick that up later. They will be able to see the message history and the message that referenced them.`;

const otherCommonInstructions = `When you are asked to do something at a future date you should use the scheduleTask tool and NOT do it immediately.`;

const triageInstructions = `You are a helpful agent that triages conversations.

You will be given a conversation message and its up to you to determine what agent you should route this message to.

YOU SHOULD NOT RESPOND TO THE QUERY DIRECTLY, ONLY TRIAGE THE MESSAGE.

You can use the tools to find out who the participants in the conversation are and what other agents the user has.".

${otherCommonInstructions}

${referenceAgentInstructions}`;

const agentReplyInstructions = `You are an agent that is part of a conversation. You will be given a message and your job is to respond to the message. You can use the tools provided to you to help you respond to the message.

${referenceAgentInstructions}

${otherCommonInstructions}

You should look at the supplied message history for added context that might be important when providing your response.

You should respond with a reference to another agent if asked or if you think the other agent could help.

If there is nothing for you to particularly do, use the noOutput tool. For example if you were referenced by another agent but your output would not be useful to the user. If the user directly asked you a question, you should respond.
`;

export type InstructionsArgs = {
  message: Doc<"conversationMessages">;
  messageAuthor: ParticipantUserOrAgent;
  conversation: Doc<"conversations">;
  agent: Doc<"agents">;
  participant: Doc<"conversationParticipants">;
};

export const constructAdditionalInstructionContext = ({
  conversation,
  message,
  messageAuthor,
  agent,
  participant,
}: InstructionsArgs) => `Here is some extra info about you the agent:
${JSON.stringify(agent, null, 2)}

Here is some extra info about you as a participant in the conversation:
${JSON.stringify(participant, null, 2)}

Here is the message:
${JSON.stringify(message, null, 2)}

Here is some information about the message author:
${JSON.stringify(messageAuthor, null, 2)}

Here is some information about the conversation:
${JSON.stringify(conversation, null, 2)}
`;

/*
Here is the message history:
${JSON.stringify(messageHistory, null, 2)}
*/

export const constructTriageInstructions = (args: InstructionsArgs) =>
  `${triageInstructions}\n\n${constructAdditionalInstructionContext(args)}`;

export const constructAgentReplyInstructions = (args: InstructionsArgs) =>
  `${agentReplyInstructions}\n\n${constructAdditionalInstructionContext(args)}`;

