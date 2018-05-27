// @flow
import * as actions from "../actions";
import { IWeekPic } from "../models";
import type { Action } from "../types/actions";

export type State = IWeekPic[];

const weekPics = (state: State = [], action: Action) => {
  switch (action.type) {
    case actions.WEEK_PICS_UPDATE_SUCCESS:
      return action.response.data;
    default:
      return state;
  }
};

export default weekPics;
