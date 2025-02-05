import { ConversationSchema } from "@models/Conversation";
import { createCollection } from "../services";

export const ConversationRepository = createCollection<ConversationSchema>(
  "conversations",
  ConversationSchema
);
