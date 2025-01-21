import { helpers, PredictionServiceClient } from "@google-cloud/aiplatform";
import env from "../../../env";

const credential = env.FIREBASE_CERTIFICATE;

const apiURL = `${env.REGION}-aiplatform.googleapis.com`;
const model = "text-embedding-004";
const task = "SEMANTIC_SIMILARITY";
const dimensionality = 768;

const client = new PredictionServiceClient({
  apiEndpoint: apiURL,
  credentials: {
    client_email: credential.client_email,
    private_key: credential.private_key,
  },
});

export const getEmbedding = async (content: string) => {
  const [{ predictions }] = await client.predict({
    endpoint: `projects/${credential.project_id}/locations/${env.REGION}/publishers/google/models/${model}`,
    instances: [helpers.toValue({ content, task })],
    parameters: helpers.toValue({
      outputDimensionality: dimensionality,
    }),
  });

  if (!predictions) {
    throw "No predictions found";
  }

  const embeddings = predictions.map((p) => {
    const embeddingsProto = p.structValue!.fields!.embeddings;
    const valuesProto = embeddingsProto.structValue!.fields!.values;
    return valuesProto.listValue!.values!.map((v) => v.numberValue);
  });

  return embeddings[0] as number[];
};
