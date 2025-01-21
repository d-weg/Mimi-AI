import { ZodObject, ZodRawShape } from "zod";
import { app } from "./app";
import { getFirestore } from "firebase-admin/firestore";

const firestore = getFirestore(app);

export const createConverter = <T>(schema: ZodObject<ZodRawShape>) => ({
  toFirestore: (data: T) => schema.parse(data),
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot): T =>
    schema.parse(snap.data()) as T,
});

export const createCollection = <T>(
  collectionPath: string,
  docSchema: ZodObject<ZodRawShape>
) =>
  firestore
    .collection(collectionPath)
    .withConverter(createConverter<T>(docSchema));
