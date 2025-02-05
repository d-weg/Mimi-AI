import { BaseEntity } from "@shared/schemas";
import { z } from "zod";

export const ConversationSchema = BaseEntity("Conversation").extend({
  id: z.string(),
  userId: z.string(),
  messages: z.any().array().optional(),
});

export type ConversationSchema = z.infer<typeof ConversationSchema>;
