import { z } from "zod";
import { dateSchema, idSchema } from "../utils";

export const BaseEntity = (entityName: string) =>
  z
    .object({
      createdAt: dateSchema,
      updatedAt: dateSchema.optional(),
      createdBy: z.string().default("system"),
      updatedBy: z.string().optional(),
    })
    .describe(entityName);
