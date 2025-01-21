import axios from "axios";

const client = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const getIPFSMetadata = async (url: string) => {
  const { data } = await client.get(`${url.replace("ipfs.io", "dweb.link")}`);

  return data;
};
