import groupBy from "lodash/groupBy";
import * as actions from "../actions";

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
const items = (state = { featuredIds: [], allIds: [], byId: {} }, action) => {
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

export function getFeaturedItems(state) {
  return state.featuredIds
    .map(id => state.byId[id])
    .filter(item => item !== undefined);
}
