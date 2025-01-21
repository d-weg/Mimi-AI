export interface DecodedAuthData {
  token: string;
  telegramId: string;
  username: string;
}

export const decodeAuthData = (encodedString: string): DecodedAuthData => {
  const jsonString = Buffer.from(encodedString, "base64").toString("utf-8");
  return JSON.parse(jsonString) as DecodedAuthData;
};
