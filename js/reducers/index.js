// @flow
import { combineReducers } from "redux";
import first from "lodash/first";
import categories, * as fromCategories from "./categories";
import items, * as fromItems from "./items";
import reviews, * as fromReviews from "./reviews";
import auth from "./auth";
import filters, * as fromFilters from "./filters";
import weekPics from "./weekpics";
import { ICategory, IItem } from "../models";

export default combineReducers({
  categories,
  items,
  reviews,
  auth,
  weekPics,
  filters
});

type State = {
  categories: fromCategories.State,
  items: fromItems.State,
  filters: fromFilters.Filters
};

export function getCategoriesWithParentId(state: State, id: number) {
  return fromCategories.getCategoriesWithParentId(state.categories, id);
}
export function getCategoryWithId(state: State, id: number): ?ICategory {
  return fromCategories.getCategoryWithId(state.categories, id);
}

export function getFeaturedItems(state: State) {
  return fromItems.getFeaturedItems(state.items);
}
export function getItemsForCategoryId(state: State, id: number) {
  return fromItems.getItemsForCategoryId(state.items, id);
}

export function getCategoryChain(state: State, childCategoryId: number) {
  return fromCategories.getCategoryChain(state.categories, childCategoryId);
}

type ItemWithIcon = IItem & { iconCode: string };
export function getItems(state: State): ItemWithIcon[] {
  return fromItems
    .getItems(state.items)
    .map(item => {
      const category = getCategoryWithId(state, item.category_id);
      if (category) {
        return {
          ...item,
          iconCode: category.icon
        };
      }
    })
    .filter(item => item);
}

export function getFilteredItems(state: State) {
  const activeCategories = fromFilters.getActiveCategories(state.filters);

  const allItems = getItems(state).map(item => ({
    ...item,
    rootCategoryId: first(getCategoryChain(state, item.category_id)).id
  }));
  return allItems.filter(
    item => activeCategories.indexOf(item.rootCategoryId) >= 0
  );
}

export function getItemWithId(state: State, itemId: number): IItem {
  return fromItems.getItemWithId(state.items, itemId);
}

export function getReviewsForItemId(state: State, itemId: number) {
  return fromReviews.getReviewsForItemId(state.reviews, itemId);
}
