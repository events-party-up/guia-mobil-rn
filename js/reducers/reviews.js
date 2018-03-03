// @flow
import * as actions from "../actions";
import { IReview } from "../models";
import groupBy from "lodash/groupBy";
import { combineReducers } from "redux";

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
  byId: { [id: string]: IReview },
  allIds: number[],
  byItemId: {
    [id: string]: number[]
  }
};

const initialState: State = {
  allIds: [],
  byId: {},
  byItemId: {}
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case actions.LOAD_REVIEWS_SUCCESS:
      return action.response.data.map(review => review.id);
    default:
      return state;
  }
};
const byId = (state = [], action) => {
  switch (action.type) {
    case actions.LOAD_REVIEWS_SUCCESS:
      return action.response.data.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
    default:
      return state;
  }
};

const byItemId = (state = [], action) => {
  switch (action.type) {
    case actions.LOAD_REVIEWS_SUCCESS:
      return groupBy(action.response.data, item => item.item_id);
    default:
      return state;
  }
};
const reviews = combineReducers({ allIds, byId, byItemId });

export default reviews;

export function getReviewsForItemId(state, id: number): IReview[] {
  const reviewsIds = state.byItemId[id];

  if (reviewsIds) {
    return reviewsIds; //.map(reviewId => state.byId[reviewId]);
  }
  return [];
}
