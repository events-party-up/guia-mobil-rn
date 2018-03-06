// @flow
import { IChar } from "../models";
import * as actions from "../actions";

export type State = IChar[];

const chars = (state: State = [], action) => {
  switch (action.type) {
    case actions.CHARS_UPDATE_SUCCESS:
      return action.response.data;
    default:
      return state;
  }
};

export default chars;

// selectors
// ===============================

export function getCharWithId(state: State, id: number): ?IChar {
  return state.find(char => char.id === id);
}
