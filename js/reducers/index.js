import { combineReducers } from "redux";
import categories from "./categories";
import items from "./items";
import comments from "./comments";
import auth from "./auth";

export default combineReducers({ categories, items, comments, auth });
