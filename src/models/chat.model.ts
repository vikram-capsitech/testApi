import { ObjectId, Schema, model } from "mongoose";
import { IEntity } from "../types";
import { EntitySchema } from "./base.schemas";

export interface IChat extends IEntity {
  users: ObjectId[];
  lastMessage: string;
  pic?: string;
  about: string;
}

const chatModel = new Schema<IChat>(
  {
    ...EntitySchema,
    users: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    lastMessage: String,
    pic: String,
    about: String,
  },
  { timestamps: true }
);

export default model("Chats", chatModel);
