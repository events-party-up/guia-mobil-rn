// @flow
import { combineReducers } from "redux";
import first from "lodash/first";
import categories, * as fromCategories from "./categories";
import items, * as fromItems from "./items";
import reviews, * as fromReviews from "./reviews";
import auth from "./auth";
import filters, * as fromFilters from "./filters";
import chars, * as fromChars from "./chars";
import weekPics from "./weekpics";
import weather from "./weather";
import galleries, * as fromGalleries from "./galleries";
import lang from "./lang";
import location from "./location";

import { ICategory, IItem } from "../models";

export default combineReducers({
  categories,
  items,
  reviews,
  auth,
  weekPics,
  filters,
  chars,
  galleries,
  weather,
  lang,
  location
});

type State = {
  categories: fromCategories.State,
  items: fromItems.State,
  reviews: fromReviews.State,
  filters: fromFilters.Filters,
  chars: fromChars.State,
  galleries: fromGalleries.State
};

// state selectors
// ==============================================

export function getCategoriesWithParentId(state: State, id: number) {
  return fromCategories.getCategoriesWithParentId(state.categories, id);
}

export function getCategoryWithId(state: State, id: number): ?ICategory {
  return fromCategories.getCategoryWithId(state.categories, id);
}

export function getFeaturedItemIds(state: State) {
  return fromItems.getFeaturedItemIds(state.items);
}

export function getCategoryChain(state: State, childCategoryId: number) {
  return fromCategories.getCategoryChain(state.categories, childCategoryId);
}

type ItemWithIcon = { id: number, coord: [number, number], iconCode: string };

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

export function isItemFavourite(state: State, itemId: number) {
  return fromItems.isItemFavourite(state.items, itemId);
}
export function getReviewsForItemId(state: State, itemId: number) {
  return fromReviews.getReviewsForItemId(state.reviews, itemId);
}

export function getCharWithId(state: State, id: number) {
  return fromChars.getCharWithId(state.chars, id);
}

export function getCharsWithIds(state: State, idList: number[]) {
  return idList
    .map(id => getCharWithId(state, id))
    .filter(char => Boolean(char));
}

export function getGalleryForItem(state: State, itemId: number) {
  return fromGalleries.getGalleryForItem(state.galleries, itemId);
}
