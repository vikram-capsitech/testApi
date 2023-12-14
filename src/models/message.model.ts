import { ObjectId, Schema, model } from "mongoose";
import { EntitySchema } from "./base.schemas";
import { IEntity } from "../types";

export interface IMessage extends IEntity {
  content: string;
  chat: ObjectId;
  seenBy: ObjectId[];
  attachment: any[];
  reaction: any[];
}

const schema = new Schema<IMessage>(
  {
    ...EntitySchema,
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chats" },
    seenBy: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    attachment: [{ type: String }],
    reaction: [{ type: String }],
  },
  { timestamps: true }
);

export default model("Messages", schema);
