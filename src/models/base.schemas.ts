import { SchemaDefinition, SchemaDefinitionType, Types } from "mongoose";
import { IEntity } from "../types";

export const EntitySchema = {
    name: { type: String, require: true, trim: true },
    owner: { type: Types.ObjectId, require: true, ref: "Users" }
} as SchemaDefinition<SchemaDefinitionType<IEntity>>