import { FastifyPluginCallback } from "fastify";
import { PrivateRequest, RouterConfig } from "../../../shared/types";

const plugin: FastifyPluginCallback = (app, opts, next) => {
  app.get(
    "/",
    {
      schema: { tags: ["Agent"] },
    },
    async (req: PrivateRequest, res) => {}
  );

  next();
};

export const agentRouter: RouterConfig = [plugin, { prefix: "/v1/agent" }];
