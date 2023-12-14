import { ObjectId } from "mongoose";

export interface IOwner {
  name: string;
}

export interface IEntity {
  name: string;
  owner: ObjectId;
}

/**
 * A wrapper to make all properties optional of a schema model to use as a projection
 */
export type ProjectionWrapper<T> = {
  [P in keyof T]?: T[P];
};
