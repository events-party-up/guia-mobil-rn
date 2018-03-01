// @flow
import { combineReducers } from "redux";
import categories, * as fromCategories from "./categories";
import items, * as fromItems from "./items";
import comments from "./comments";
import auth from "./auth";
import weekPics from "./weekpics";

export default combineReducers({ categories, items, comments, auth, weekPics });

export function getCategoriesWithParentId(state, id) {
    return fromCategories.getCategoriesWithParentId(state.categories, id);
}
export function getCategoryWithId(state, id: number) {
    return fromCategories.getCategoryWithId(state.categories, id);
}

export function getFeaturedItems(state) {
    return fromItems.getFeaturedItems(state.items);
}
export function getItemsForCategoryId(state, id: number) {
    return fromItems.getItemsForCategoryId(state.items, id);
}

export function getCategoryChain(state: State, childCategoryId: number) {
    return fromCategories.getCategoryChain(state.categories, childCategoryId);
}

export function getItems(state) {
    return fromItems.getItems(state.items).map(item => ({
        ...item,
        iconCode: getCategoryWithId(state, item.category_id).icon
    }));
}
