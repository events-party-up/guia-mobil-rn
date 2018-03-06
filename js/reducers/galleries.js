// @flow
import { combineReducers } from "redux";
import * as actions from "../actions";

type GalleryPic = {
  id: number,
  item_id: number,
  image: string,
  width: number,
  height: number
};

type Gallery = GalleryPic[];

export type State = {
  allIds: number[],
  byId: {
    [key: number]: GalleryPic
  },
  byItemId: {
    [key: number]: number[]
  }
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case actions.ITEM_GALLERY_LOAD_SUCCESS:
      return {
        ...state,
        ...action.response.data.entities.pictures
      };
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case actions.ITEM_GALLERY_LOAD_SUCCESS: {
      return [...state, ...action.response.data.result];
    }
    default:
      return state;
  }
};

const byItemId = (state = {}, action) => {
  switch (action.type) {
    case actions.ITEM_GALLERY_LOAD_SUCCESS: {
      return {
        ...state,
        [action.itemId]: action.response.data.result
      };
    }
    default:
      return state;
  }
};

export default combineReducers({
  allIds,
  byItemId,
  byId
});

// selectors
// ======================================

export function getPictureById(state: State, id: number): GalleryPic {
  return state.byId[id];
}

export function getGalleryForItem(state: State, itemId: number): Gallery {
  const picturesIds = state.byItemId[itemId];
  if (picturesIds) {
    return picturesIds.reduce((acc, id) => {
      if (state.byId[id]) acc.push(state.byId[id]);
      return acc;
    }, []);
  }
  return [];
}
