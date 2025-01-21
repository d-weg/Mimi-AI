import { VectorValue } from "@google-cloud/firestore";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { ObjectId } from "mongodb";
import { z, ZodObject, ZodRawShape } from "zod";
import { ObjectDefinition, s } from "ajv-ts";
import { CustomObjectSchema } from "./types";

export const parseBearerToken = (bearerToken: string | string[]) => {
  if (!bearerToken || typeof bearerToken !== "string") {
    return null;
  }

  const parts = bearerToken.split(" ");

  if (parts.length === 2 && parts[0] === "Bearer") {
    return parts[1];
  }

  return null;
};

export const formatMC = (value: number) => {
  const valueInThousands = value / 1000000000;

  const units = ["K", "M", "B", "T"];
  let unitIndex = 0;

  let formattedValue = valueInThousands;
  while (formattedValue >= 1000 && unitIndex < units.length - 1) {
    formattedValue /= 1000;
    unitIndex++;
  }

  const roundedValue = Math.round(formattedValue * 100) / 100;

  const finalValue =
    roundedValue % 1 === 0 ? roundedValue.toString() : roundedValue.toFixed(2);

  return finalValue + units[unitIndex];
};

export const parseFileType = (fileName: string) => {
  const parts = fileName.split(".");
  return parts[parts.length - 1];
};

export const filterFields = <T>(
  schema: ZodObject<ZodRawShape>,
  fields: (keyof T)[],
  value: T
): Omit<T, (typeof fields)[number]> => {
  const omitConfig = fields.reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {} as { [k in keyof T]: true });

  const filteredSchema = schema.omit(omitConfig as never);

  return filteredSchema.parse(value) as Omit<T, (typeof fields)[number]>;
};

export const EntitySchema: CustomObjectSchema = {
  object: (def?: ObjectDefinition) => {
    return s.object(def).postprocess((data) => {
      return data;
    }, s.object());
  },
};

export const PaginatedParams = z.object({
  page: z.number(),
  pageSize: z.number(),
});

export const parseJSON = (data?: string | null) => {
  if (!data) return null;

  if (typeof data === "string") return JSON.parse(data);
};

export const parseBoolean = (value: unknown) => {
  if (!value) return false;

  if (value === "true") return true;

  if (value === "false") return false;

  return true;
};

export const idSchema = z.preprocess((value) => {
  if (value instanceof ObjectId) {
    return value.toString();
  }

  if (typeof value === "string") return new ObjectId(value);

  if (!value) return new ObjectId();
}, z.instanceof(ObjectId).or(z.coerce.string()).optional());

export const dateSchema = z
  .preprocess((value) => {
    if (value instanceof Timestamp) {
      return value.toDate().toISOString();
    }

    return String(value);
  }, z.coerce.string())
  .transform((value: string | Timestamp) => {
    if (value instanceof Timestamp) {
      return value.toDate().toISOString();
    }
    const date = new Date(value);

    if (isNaN(date.getTime())) throw "Invalid Date Format Provided";

    return date;
  });

export const vectorSchema = z
  .preprocess((value: VectorValue | number[]) => {
    if (value instanceof VectorValue) {
      return value.toArray();
    }
    return value;
  }, z.coerce.number().array())
  .transform((value: number[]) => {
    return FieldValue.vector(value);
  });
