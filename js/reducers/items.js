// @flow
import * as actions from "../actions";
import { combineReducers } from "redux";
import getRealm from "../database";

// store a lot less data in memory

type TinyItem = {
  id: number,
  category_id: number,
  coord: [number, number]
};

export type State = {
  featuredIds: number[],
  favouriteIds: number[],
  byId: {
    [id: number]: TinyItem
  }
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case actions.ITEMS_UPDATE_SUCCESS: {
      const nextState = { ...state };

      action.response.data.forEach(item => {
        nextState[item.id] = {
          id: item.id,
          category_id: item.category_id,
          coord: item.coord
        };
      });
      return nextState;
    }
    default:
      return state;
  }
};

const favoritesIds = (state = [], action) => {
  switch (action.type) {
    case actions.ITEM_TOGGLE_FAVOURITE: {
      const itemId = action.payload;
      const idx = state.indexOf(itemId);
      if (idx < 0) {
        // add the item, now it is favourite
        return [...state, itemId];
      }
      // remove the item, no favorite anymore
      return [...state.slice(0, idx), ...state.slice(idx + 1)];
    }
    default:
      return state;
  }
};

const featuredIds = (state = [], action) => {
  switch (action.type) {
    case actions.ITEMS_UPDATE_FEATURED_SUCCESS:
      return action.response.data;
    default:
      return state;
  }
};

const items = combineReducers({
  featuredIds,
  favoritesIds,
  byId
});

export default items;

// selectors
// ================
export const getItems = (state: State) => {
  return Object.keys(state.byId).reduce((acc, id) => {
    acc.push(state.byId[parseInt(id, 10)]);
    return acc;
  }, []);
};

export const getFeaturedItemIds = (state: State) => state.featuredIds;
