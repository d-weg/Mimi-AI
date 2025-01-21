import { z } from "zod";
import { BaseEntity } from "../shared/schemas";

export const SampleSchema = BaseEntity("Sample").extend({
  username: z.string(),
});

export type SampleSchema = z.infer<typeof SampleSchema>;
