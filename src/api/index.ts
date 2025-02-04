import fastify from "fastify";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import cors from "@fastify/cors";

import * as hooks from "./hooks/onRequest";

import * as Routers from "./features";
import config from "@config";

export const api = fastify({
  requestTimeout: 3000,
  logger: true,
});

export const setup = async () => {
  api.register(cors);
  api.register(helmet);
  api.addHook("onRequest", hooks.verifyAuthAndRole);
  api.addHook("onRequest", hooks.userValidationMiddleware);
  api.register(...Routers.agentRouter);

  if (config.api.LOCAL) {
    api.register(swagger, {
      openapi: {
        info: {
          title: "Mimi AI",
          version: "1.0",
        },
      },
    });
    api.register(swaggerUI, {
      routePrefix: "documentation",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      staticCSP: true,
      transformSpecificationClone: true,
    });
  }
  await api.ready();
};

setup();
