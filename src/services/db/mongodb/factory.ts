import { Filter, ObjectId } from "mongodb";
import { db } from "./db";
import { ZodObject, ZodRawShape } from "zod";
import { GetManyPaginatedResponse } from "./types";

export const createRepository = <T>(
  collection: string,
  schema: ZodObject<ZodRawShape>
) => {
  const arraySchema = schema.array();
  const updateSchema = schema.omit({ _id: true }).partial();
  return {
    addOne: async (itemData: T) =>
      await db.collection(collection).insertOne(schema.parse(itemData)),

    updateById: async (itemData: Record<string, any>, itemId: string) =>
      await db.collection(collection).updateOne(
        {
          _id: new ObjectId(itemId),
        },
        { $set: updateSchema.parse(itemData) }
      ),
    updateOneBy: async (itemData: Record<string, any>, filters: Filter<T>) =>
      await db
        .collection(collection)
        .updateOne(filters, { $set: updateSchema.parse(itemData) }),
    updateMany: async (
      itemData: Record<string, any>,
      filters: Record<string, any>
    ) =>
      await db
        .collection(collection)
        .updateMany(filters, { $set: updateSchema.parse(itemData) }),

    getById: async (id: string, includeEmbedding?: boolean): Promise<T> => {
      const item = await db
        .collection(collection)
        .findOne({ _id: new ObjectId(id) });

      if (!item) {
        console.error(`Resource with id: ${id} not found`);
        throw new Error(`Resource with id: ${id} not found`);
      }

      if (!includeEmbedding) {
        let getSchema = schema.omit({ embedding: true });

        return getSchema.parse(item) as T;
      }

      return schema.parse(item) as T;
    },

    getOne: async (
      filters: Filter<T>,
      includeEmbedding?: boolean
    ): Promise<T | null> => {
      const item = await db.collection(collection).findOne(filters);

      if (!item) {
        return null;
      }

      if (!includeEmbedding) {
        let getSchema = schema.omit({ embedding: true });

        return getSchema.parse(item) as T;
      }

      return schema.parse(item) as T;
    },

    getMany: async (
      filters: Record<string, any>,
      options?: Record<string, any>,
      includeEmbedding?: boolean
    ): Promise<T[]> => {
      const data = await db
        .collection(collection)
        .find(filters, options)
        .toArray();

      if (!includeEmbedding) {
        let getArraySchema = schema.omit({ embedding: true }).array();

        return getArraySchema.parse(data) as T[];
      }

      return arraySchema.parse(data) as T[];
    },

    getManyPaginated: async (
      filters: Record<string, any>,
      { page = 1, pageSize = 10, ...otherOptions }: Record<string, any>,
      includeEmbedding?: boolean
    ): Promise<GetManyPaginatedResponse<T>> => {
      const skip = (page - 1) * pageSize;

      const data = await db
        .collection(collection)
        .find(filters, { limit: parseInt(pageSize), skip, ...otherOptions })
        .toArray();

      const total = await db.collection(collection).countDocuments(filters);

      if (!includeEmbedding) {
        let getArraySchema = schema.omit({ embedding: true }).array();

        return {
          data: getArraySchema.parse(data) as T[],
          total,
          totalPages: Math.ceil(total / pageSize),
          page,
        };
      }

      return {
        data: arraySchema.parse(data) as T[],
        total,
        totalPages: Math.ceil(total / pageSize),
        page,
      };
    },

    countAggregate: async (
      filters: Record<string, any>,
      groupBy: string,
      fieldName: string = groupBy
    ) =>
      await db
        .collection(collection)
        .aggregate([
          { $match: filters },
          { $group: { _id: `$${groupBy}`, count: { $sum: 1 } } },
          { $project: { [fieldName]: "$_id", count: 1 } },
        ])
        .toArray(),

    getNearest: async (
      embedding: number[],
      limit: number,
      includeEmbedding?: boolean,
      filters: Record<string, unknown> = {}
    ): Promise<T[]> => {
      const data = await db
        .collection(collection)
        .aggregate([
          {
            $vectorSearch: {
              index: "vector_index",
              path: "embedding",
              queryVector: embedding,
              limit,
              numCandidates: 150,
            },
          },
          {
            $addFields: {
              score: {
                $meta: "vectorSearchScore",
              },
            },
          },
          filters,
        ])
        .toArray();

      if (!includeEmbedding) {
        let getArraySchema = schema.omit({ embedding: true }).array();

        return getArraySchema.parse(data) as T[];
      }

      return arraySchema.parse(data) as T[];
    },

    count: async (): Promise<number> => {
      return await db.collection(collection).estimatedDocumentCount();
    },
  };
};
