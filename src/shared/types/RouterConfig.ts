import { FastifyPluginCallback, FastifyPluginOptions, FastifyRegisterOptions } from "fastify";


export type RouterConfig = [
    FastifyPluginCallback,
    FastifyRegisterOptions<FastifyPluginOptions>
]