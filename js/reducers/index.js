// @flow
import { combineReducers } from "redux";
import categories, * as fromCategories from "./categories";
import items, * as fromItems from "./items";
import comments from "./comments";
import auth from "./auth";
import filters, * as fromFilters from "./filters";
import weekPics from "./weekpics";
import first from "lodash/first";

export default combineReducers({
    categories,
    items,
    comments,
    auth,
    weekPics,
    filters
});

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

export function getFilteredItems(state) {
    const activeCategories = fromFilters.getActiveCategories(state.filters);

    console.log({ activeCategories });

    const items = getItems(state).map(item => ({
        ...item,
        rootCategoryId: first(getCategoryChain(state, item.category_id)).id
    }));
    console.log({ items });
    return items.filter(
        item => activeCategories.indexOf(item.rootCategoryId) >= 0
    );
}

export function getItemWithId(state, itemId: number) {
    return fromItems.getItemWithId(state.items, itemId);
}
