import { getHost, parseBoolean, parseJSON } from "@shared";
import { ServiceAccount } from "@shared/types";

interface Env {
  LOCAL: boolean;
  PORT: string;
  BASE_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  FIREBASE_CERTIFICATE: string;
  API_KEY: string;
  REGION: string;
  MONGO_CONNECTION_STRING: string;
}
const env: Env = process.env as unknown as Env;

const config = {
  api: {
    LOCAL: parseBoolean(env.LOCAL),
    PORT: parseInt(process.env.PORT) || 3000,
    BASE_URL: getHost(parseBoolean(env.LOCAL)),
    API_KEY: env.API_KEY,
  },
  redis: {
    HOST: env.REDIS_HOST || "localhost",
    PORT: parseInt(env.REDIS_PORT as never) || 6379,
  },
  firebase: {
    CERTIFICATE: parseJSON(env.FIREBASE_CERTIFICATE) as ServiceAccount,
  },
  vertex: {
    CERTIFICATE: parseJSON(env.FIREBASE_CERTIFICATE) as ServiceAccount,
    REGION: env.REGION || "south-america-east1",
  },
};

export default config;
