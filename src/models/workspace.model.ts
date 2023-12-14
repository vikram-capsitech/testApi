import { Schema, model } from "mongoose";
import { IEntity } from "../types";
import { EntitySchema } from "./base.schemas";

export interface IWorkspace extends IEntity { } 

const schema = new Schema<IWorkspace>(
    {
        ...EntitySchema
    },
    { timestamps: true }
);

export default model("Workspaces", schema);
