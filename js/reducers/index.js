import { combineReducers } from "redux";
import categories, * as fromCategories from "./categories";
import items from "./items";
import comments from "./comments";
import auth from "./auth";

export default combineReducers({ categories, items, comments, auth });

export function getCategoriesWithParentId(state, id) {
    return fromCategories.getCategoriesWithParentId(state.categories, id);
}
