import { FastifyPluginCallback } from "fastify";
import { PrivateRequest, RouterConfig } from "@shared/types";
import { client, publisher } from "@redis";
import { Events } from "@shared/types/Events";
import { ConversationRepository } from "@repositories/Conversation.repository";
import { FieldValue } from "firebase-admin/firestore";
import { ConversationParams } from "@api/features/Agent/agent.requests";

const plugin: FastifyPluginCallback = (app, opts, next) => {
  app.get(
    "/:agentId/conversations/:conversationId",
    {
      schema: { tags: ["Agent"] },
      websocket: true,
    },
    async (socket, req: PrivateRequest<{}, ConversationParams>) => {
      const { agentId, conversationId } = req.params;
      console.log(req.query);
      console.log(req.headers);
      const cachedConversation = await client.get(conversationId);
      if (!cachedConversation) {
        const conversationRef = await ConversationRepository.doc(
          conversationId
        ).get();
        if (conversationRef.exists)
          await client.set(
            conversationId,
            JSON.stringify(conversationRef.data())
          );

        publisher.publish(
          Events.CONVERSATION_START,
          JSON.stringify({
            agentId,
            conversationId,
            userId: "teste",
            timestamp: Date.now(),
          })
        );
      }
    }
  );

  next();
};

export const agentRouter: RouterConfig = [plugin, { prefix: "/v1/agent" }];
