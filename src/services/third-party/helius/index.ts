import axios from "axios";
import env from "../../../env";


const client = axios.create({
  baseURL: `${env.HELIUS_API_URL}/?api-key=${env.HELIUS_API_KEY}`,
});

export const getMetadata = async (token: string) => {
  const { data } = await client.post('',
    {
      jsonrpc: "2.0",
      id: token,
      method: "getAsset",
      params: {
        id: token
      }
    })

  return data.result
};