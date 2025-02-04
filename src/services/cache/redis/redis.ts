import Redis from "ioredis";
import config from "@config";

export const client = new Redis({
  host: config.redis.HOST,
  port: config.redis.PORT,
});

export const publisher = new Redis({
  host: config.redis.HOST,
  port: config.redis.PORT,
});

export const subscriber = new Redis({
  host: config.redis.HOST,
  port: config.redis.PORT,
});
