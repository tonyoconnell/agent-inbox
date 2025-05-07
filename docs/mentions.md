How Mentions Work
1. Mention Syntax
Mentions use a markdown-like syntax: @[Name](kind:ID)
For agents: @[Agent Name](agent:AGENT_ID)
For users: @[User Name](user:USER_ID)
This is parsed and rendered in the UI as clickable badges (with avatars, etc).
2. Parsing and Rendering
Parsing: The function parseMentionsFromMessageContent (in shared/mentions.ts) extracts all mentions from a message, returning their type (user/agent), ID, and display name.
Rendering: Components like AgentMention and UserMention (in /src/components/authenticated/chat/) render these as interactive UI elements.
Suggestions: When typing @, a popup suggests users and agents in the conversation.
3. Message Routing
If a message contains mentions, it is routed to the mentioned participants (users or agents).
If there are no mentions, the "Triage Agent" decides who should handle the message.
4. Agent Ownership
Agents have a createdBy field (see agentsSchemaValidator), tying them to a user. Agents now have a single 'prompt' field for their master prompt and operational instructions, instead of separate fields for goal, systemPrompt, personality, and instructions.
By default, only the creator can update or delete their agent.
Agents can be added to conversations by any user (with permission), and then mentioned by anyone in that conversation.
Social Network & Permissions Proposal
Goals
Allow users to mention other users and agents in any conversation.
Allow agents created by one user to be used (invoked, mentioned) by others, with clear permissions.
Keep the model simple and intuitive.
Permissions Model
1. Agent Visibility
Public Agents: Any user can add/mention these agents in their conversations.
Private Agents: Only the creator (and optionally, invited users) can add/mention these agents.
Default: New agents are public unless marked private.
2. Agent Usage
Any user can mention any public agent in a conversation they participate in.
Mentioning an agent adds them to the conversation (if not already present).
Agents respond to mentions according to their logic/tools.
3. Agent Management
Only the creator can edit or delete their agent.
Only the creator can make an agent public/private.
Anyone can view a public agent's profile and see their description, tools, etc.
4. User Mentions
Any user in a conversation can mention any other participant (user or agent).
Mentioning a user not in the conversation could trigger an invite (optional, for future).
5. Conversation Participation
Users can add agents (public or their own private) to conversations.
Agents can be removed from conversations (except system agents), unless restricted by the agent's owner.
Example Scenarios
Alice creates AgentA (public).
Bob can add AgentA to his conversation and mention it. AgentA will respond as designed.
Alice creates AgentB (private).
Only Alice can add/mention AgentB in her conversations (unless she explicitly shares it).
Bob mentions Alice in a message:
@[Alice](user:ALICE_ID) — Alice is notified or highlighted in the conversation.
allow anybody mention anybody else in a conversation. allow users with tools to remove and block. 