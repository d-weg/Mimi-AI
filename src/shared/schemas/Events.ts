import { Events } from "@shared/types/Events";
import { z } from "zod";

const ConversationStartSchema = z.object({
  agentId: z.string(),
  conversationId: z.string(),
  userId: z.string(),
  timestamp: z.number(),
});

const ConversationMessageSchema = z.object({
  conversationId: z.string(),
  userId: z.string(),
  message: z.string(),
  timestamp: z.number(),
});

const AgentActionSchema = z.object({
  agentId: z.string(),
  action: z.string(),
  payload: z.any().optional(),
});

const AgentResponseSchema = z.object({
  agentId: z.string(),
  conversationId: z.string(),
  response: z.string(),
  timestamp: z.number(),
});

const WorkerTaskSchema = z.object({
  taskId: z.string(),
  workerId: z.string(),
  taskType: z.string(),
  payload: z.any(),
});

const WorkerResultSchema = z.object({
  taskId: z.string(),
  workerId: z.string(),
  success: z.boolean(),
  result: z.any(),
});

export const EventSchemas = {
  [Events.CONVERSATION_START]: ConversationStartSchema,
  [Events.CONVERSATION_MESSAGE]: ConversationMessageSchema,
  [Events.AGENT_ACTION]: AgentActionSchema,
  [Events.AGENT_RESPONSE]: AgentResponseSchema,
  [Events.WORKER_TASK]: WorkerTaskSchema,
  [Events.WORKER_RESULT]: WorkerResultSchema,
};
