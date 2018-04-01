import { parseCoordinate, parseChars } from "../utils";
import getRealm from "../database";

export const ITEMS_UPDATE = "ITEMS_UPDATE";
export const ITEMS_UPDATE_SUCCESS = "ITEMS_UPDATE_SUCCESS";
export const ITEMS_UPDATE_FAILURE = "ITEMS_UPDATE_FAILURE";
export const ITEM_TOGGLE_FAVOURITE = "ITEM_TOGGLE_LIKE";
export const ITEM_ADD_COMMENT = "ITEM_ADD_COMMENT";

export const itemsUpdate = options => ({
  type: ITEMS_UPDATE,
  apiCall: apiClient =>
    apiClient.get("update/items/0").then(res => {
      const itemList = res.data.map(item => ({
        ...item,
        coord: parseCoordinate(item.coord),
        chars: parseChars(item.chars)
      }));
      const filteredItems = itemList.filter(item => item.coord.length === 2);
      getRealm().then(realm => {
        realm.write(() => {
          filteredItems.forEach(item => realm.create("Item", item, true));
        });
      });
      return {
        data: filteredItems
      };
    }),
  options
});

export const ITEMS_UPDATE_FEATURED = "ITEMS_UPDATE_FEATURED";
export const ITEMS_UPDATE_FEATURED_SUCCESS = "ITEMS_UPDATE_FEATURED_SUCCESS";
export const ITEMS_UPDATE_FEATURED_FAILURE = "ITEMS_UPDATE_FEATURED_FAILURE";

export const itemsLoadFeatured = options => ({
  type: ITEMS_UPDATE_FEATURED,
  apiCall: apiClient =>
    apiClient.get("update/featured/0").then(res => {
      const itemList = res.data.map(item => item.item_id);
      return {
        data: itemList
      };
    }),
  options
});

export const toggleFavourite = id => ({
  type: ITEM_TOGGLE_FAVOURITE,
  payload: id
});
