import { ObjectId, Schema, model } from "mongoose";
import { compare, genSalt, hash } from "bcryptjs";
import { EntitySchema } from "./base.schemas";
import { IOwner } from "../types";

enum Roles {
  User,
  Moderator,
  Admin,
}

interface IUser extends IOwner {
  faction: ObjectId;
  workspaces: ObjectId[];
  chats: ObjectId[];
  channels: ObjectId[];
  organization: ObjectId;
  role: Roles;
  email: string;
  password: string;
  pic: string;
}

const userSchema = new Schema<IUser>(
  {
    ...EntitySchema,
    faction: { type: Schema.Types.ObjectId, ref: "Factions" },
    workspaces: [{ type: Schema.Types.ObjectId, ref: "Workspaces" }],
    email: { type: "String", unique: true, required: true },
    password: {
      type: "String",
      required: [true, "Password is required"],
      minLength: [6, "Password cannot be less then 6 characters."],
      trim: true,
      select: false, // To hide users password in response
    },
    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    role: {
      type: "Number",
      enum: Roles,
      required: true,
      default: Roles.User,
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  // return await compare(enteredPassword, this.password);
  return enteredPassword === this.password;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

export default model("Users", userSchema);