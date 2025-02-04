import { SampleSchema } from "../models";
import { createCollection } from "../services";

export const SampleRepositoryFs = createCollection<SampleSchema>(
  "samples",
  SampleSchema
);
