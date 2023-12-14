import { Schema, model } from "mongoose";
import { EntitySchema } from "./base.schemas";
import { IEntity } from "../types";

export interface IFaction extends IEntity { }

const schema = new Schema<IFaction>(
    {
        ...EntitySchema
    },
    { timestamps: true }
);

export default model("Factions", schema);