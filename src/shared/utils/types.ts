import { Object, ObjectDefinition } from "ajv-ts";

export interface CustomObjectSchema {
    object: (def?: ObjectDefinition) => Object
}
