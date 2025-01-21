import fastify from "fastify";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import cors from "@fastify/cors";

import * as hooks from "./hooks/onRequest";

import * as Routers from "./features";

export const app = fastify({
  requestTimeout: 3000,
  logger: true,
});

const setup = async () => {
  app.register(swagger, {
    openapi: {
      info: {
        title: "Trench Hub",
        version: "1.0",
      },
    },
  });
  app.register(swaggerUI, {
    routePrefix: "documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecificationClone: true,
  });
  app.register(cors);
  app.register(helmet);
  app.addHook("onRequest", hooks.verifyAuthAndRole);
  app.addHook("onRequest", hooks.userValidationMiddleware);
  app.register(...Routers.sampleRouter);

  await app.ready();
};

setup();
