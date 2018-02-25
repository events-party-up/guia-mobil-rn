// @flow
import * as actions from "../actions";

export type Comment = {
  id: number,
  text: string
};

let count = 0;
const addComment = (state: Comment[] = [], action) => {
  switch (action.type) {
    case actions.ITEM_ADD_COMMENT: {
      const { comment, starRating, priceRating } = action.payload;
      return [
        ...state,
        {
          id: ++count, // eslint-disable-line no-plusplus
          text: comment,
          starRating,
          priceRating,
          created: new Date()
        }
      ];
    }
    default:
      return state;
  }
};

export type State = {
  [id: string]: Comment[]
};

const comments = (state: State = {}, action) => {
  switch (action.type) {
    case actions.ITEM_ADD_COMMENT: {
      const itemId = action.payload.id;
      return { ...state, [itemId]: addComment(state[itemId], action) };
    }
    default:
      return state;
  }
};
export default comments;
