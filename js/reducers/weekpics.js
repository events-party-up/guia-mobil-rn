// @flow
import * as actions from "../actions";
import { IWeekPic } from "../models";

export type State = IWeekPic[];

const weekPics = (state: State = [], action) => {
  switch (action.type) {
    case actions.WEEK_PICS_UPDATE_SUCCESS:
      return action.response.data;
    default:
      return state;
  }
};

export default weekPics;
