import { FastifyRequest } from "fastify";
import { RequestRouteOptions } from "fastify/types/request";
import { CustomRouteConfig, PrivateRoute, PublicRoute } from "./Route";
import { Context } from "./Context";

export interface CustomFastifyRequest<Body = {}, Params = {}, Query = {}>
  extends FastifyRequest {
  headers: {
    "x-api-key": string;
    authorization?: string;
  };
  routeOptions: RequestRouteOptions<CustomRouteConfig>;
  context?: Context;
  body: Body;
  params: Params;
  query: Query;
}

export interface PrivateRequest<Body = {}, Params = {}, Query = {}>
  extends CustomFastifyRequest {
  headers: {
    "x-api-key": string;
    authorization: `Bearer ${string}`;
  };
  routeOptions: RequestRouteOptions<PrivateRoute>;
  context?: Context;
  body: Body;
  params: Params;
  query: Query;
}

export interface PublicRequest<Body = {}, Params = {}, Query = {}>
  extends CustomFastifyRequest {
  headers: {
    "x-api-key": string;
    authorization?: string;
  };
  routeOptions: RequestRouteOptions<PublicRoute>;
  context?: Context;
  body: Body;
  params: Params;
  query: Query;
}
