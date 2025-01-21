import { SampleSchema } from "../models";
import { createCollection } from "../services";
import { createRepository } from "../services/db/mongodb";

export const SampleRepository = createRepository<SampleSchema>(
  "samples",
  SampleSchema
);

export const SampleRepositoryFs = createCollection<SampleSchema>(
  "samples",
  SampleSchema
);
