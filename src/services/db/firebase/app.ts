import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import env from "../../../env";

const credential = env.FIREBASE_CERTIFICATE as ServiceAccount;

export const app = initializeApp({
  credential: cert(credential),
});
