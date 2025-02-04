import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import config from "@config";

const credential = config.firebase.CERTIFICATE as ServiceAccount;

export const app = initializeApp({
  credential: cert(credential),
});
