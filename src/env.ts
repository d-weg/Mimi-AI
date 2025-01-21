import { parseBoolean, parseJSON } from "./shared";
import { ServiceAccount } from "./shared/types";

interface Env {
  IS_LOCAL: boolean;
  PORT: number;
  FIREBASE_CERTIFICATE: ServiceAccount;
  API_KEY: string;
  REGION: string;
  MONGO_CONNECTION_STRING: string;
  HELIUS_API_URL: string;
  HELIUS_API_KEY: string;
  MORALIS_API_URL: string;
  MORALIS_API_KEY: string;
}

const env: Env = {
  IS_LOCAL: parseBoolean(process.env.IS_LOCAL),
  PORT: parseInt(process.env.PORT),
  FIREBASE_CERTIFICATE: parseJSON(process.env.FIREBASE_CERTIFICATE),
  API_KEY: process.env.API_KEY,
  REGION: process.env.REGION ?? "southamerica-east1",
  MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
  HELIUS_API_URL: process.env.HELIUS_API_URL,
  HELIUS_API_KEY: process.env.HELIUS_API_KEY,
  MORALIS_API_URL: process.env.MORALIS_API_URL,
  MORALIS_API_KEY: process.env.MORALIS_API_KEY,
};

export default env;
