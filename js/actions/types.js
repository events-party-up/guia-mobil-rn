// @flow
import * as actions from "./index";
import type { FacebookProfileData } from "./auth";

type UserProfile = {
  id: string,
  firstName: string,
  lasyName: string,
  profilePicUrl: string
};

export type Action =
  | { type: actions.ADD_ITEM_REVIEW_SUCCESS }
  | { type: actions.actions.SET_USER_PROFILE, payload: UserProfile }
  | { type: actions.LOGOUT }
  | { type: actions.RECEIVED_PUSH_NOTIFICATION, notification: Object }
  | {
      type: actions.SET_FACEBOOK_CREDENTIALS,
      credentials: { userId: string, token: string },
      profile: FacebookProfileData
    };

export type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;

export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
