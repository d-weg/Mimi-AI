import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const ConversationParams = z.object({
  conversationId: z.string(),
  agentId: z.string(),
});

export type ConversationParams = z.infer<typeof ConversationParams>;

export const ConversationParamsSchema = zodToJsonSchema(ConversationParams);
