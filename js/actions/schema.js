import { schema } from "normalizr";

export const category = new schema.Entity("categories");
export const arrayOfCategories = new schema.Array(category);
export const item = new schema.Entity("items");
export const arrayOfItems = new schema.Array(item);
