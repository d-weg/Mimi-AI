import { ProfileSchema } from "../../models";
import { DecodedAuthData } from "../utils/auth";

export interface Context {
  profile?: ProfileSchema;
  user?: DecodedAuthData;
}
