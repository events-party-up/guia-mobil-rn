// @flow
import groupBy from "lodash/groupBy";
import * as actions from "../actions";
import { IItem } from "../models";

const byId = (state = {}, action) => {
  switch (action.type) {
    case actions.ITEMS_UPDATE_SUCCESS: {
      const nextState = { ...state };
      action.response.data.forEach(item => {
        const oldItem = nextState[item.id];
        nextState[item.id] = {
          ...item,
          isFavourite: oldItem ? oldItem.isFavourite : false
        };
      });
      return nextState;
    }
    case actions.ITEM_TOGGLE_FAVOURITE: {
      const id = action.payload;
      const item = state[id];
      const updatedItem = {
        ...item,
        isFavourite: !item.isFavourite
      };
      return {
        ...state,
        [id]: updatedItem
      };
    }
    default:
      return state;
  }
};

type State = {
  featuredIds: number[],
  allIds: number[],
  byId: {
    [key: number]: IItem
  },
  byCategoryId: {
    [key: number]: IItem[]
  }
};

const initialState = {
  featuredIds: [],
  allIds: [],
  byId: {},
  byCategoryId: {}
};

const items = (state: State = initialState, action) => {
  switch (action.type) {
    case actions.ITEMS_UPDATE_SUCCESS:
      return {
        ...state,
        allIds: action.response.data.map(item => item.id),
        byCategoryId: groupBy(action.response.data, item => item.category_id),
        byId: byId(state.byId, action)
      };
    case actions.ITEMS_UPDATE_FEATURED_SUCCESS:
      return {
        ...state,
        featuredIds: action.response.data
      };
    case actions.ITEM_TOGGLE_FAVOURITE:
      return {
        ...state,
        byId: byId(state.byId, action)
      };
    default:
      return state;
  }
};

export default items;

// selectors
export function getFeaturedItems(state: State) {
  return state.featuredIds
    .map(id => state.byId[id])
    .filter(item => item !== undefined);
}

export function getItemsForCategoryId(state: State, categoryId: number): Array<IItem> {
  return state.byCategoryId[categoryId] || [];
}
