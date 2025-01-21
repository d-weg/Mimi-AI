import axios from "axios";
import env from "../../../env";


// const response = Moralis.SolApi.token.getTokenPrice({
//   "network": "mainnet",
//   "address": "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt"
// });

const client = axios.create({
  baseURL: env.MORALIS_API_URL,
  headers: {
    accept: 'application/json',
    'X-API-Key': env.MORALIS_API_KEY
  },
});

export const getPrice = async (token: string) => {
  const { data } = await client.get(`/token/mainnet/${token}/price`)

  return data
};


export const getMetadata = async (token: string) => {
  const { data } = await client.get(`/token/mainnet/${token}/metadata`)

  return data
};