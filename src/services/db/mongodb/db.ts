import { MongoClient, ServerApiVersion } from "mongodb";
import env from "../../../env";

const client = new MongoClient(env.MONGO_CONNECTION_STRING, {
  serverApi: ServerApiVersion.v1,
});

export const db = client.db("trench-hub-db");
