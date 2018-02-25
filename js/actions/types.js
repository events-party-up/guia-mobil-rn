// @flow
import * as actions from "./index";

type ParseObject = Object;
type UserProfile = {
  id: string,
  first_name: string,
  lasy_name: string,
  picture: { data: any }
};

export type Action =
  | { type: actions.ADD_ITEM_REVIEW_SUCCESS }
  | { type: actions.SET_FACEBOOK_CREDENTIALS, payload: {} }
  | { type: actions.actions.SET_USER_PROFILE, payload: UserProfile }
  | { type: actions.LOGOUT }
  | { type: actions.RECEIVED_PUSH_NOTIFICATION, notification: Object }
  | { type: "LOADED_ABOUT", list: Array<ParseObject> }
  | { type: "LOADED_NOTIFICATIONS", list: Array<ParseObject> }
  | { type: "LOADED_MAPS", list: Array<ParseObject> }
  | {
      type: "LOADED_FRIENDS_SCHEDULES",
      list: Array<{
        id: string,
        name: string,
        schedule: { [key: string]: boolean }
      }>
    }
  | { type: "LOADED_CONFIG", config: ParseObject }
  | { type: "LOADED_SESSIONS", list: Array<ParseObject> }
  | { type: "LOADED_SURVEYS", list: Array<Object> }
  | { type: "SUBMITTED_SURVEY_ANSWERS", id: string }
  | {
      type: "LOGGED_IN",
      source: ?string,
      data: { id: string, name: string, sharedSchedule: ?boolean }
    }
  | { type: "RESTORED_SCHEDULE", list: Array<ParseObject> }
  | { type: "SKIPPED_LOGIN" }
  | { type: "SESSION_ADDED", id: string }
  | { type: "SESSION_REMOVED", id: string }
  | { type: "SET_SHARING", enabled: boolean }
  | { type: "APPLY_TOPICS_FILTER", topics: { [key: string]: boolean } }
  | { type: "CLEAR_FILTER" }
  | { type: "SWITCH_DAY", day: 1 | 2 }
  | {
      type: "SWITCH_TAB",
      tab: "schedule" | "my-schedule" | "map" | "notifications" | "info"
    }
  | { type: "TURNED_ON_PUSH_NOTIFICATIONS" }
  | { type: "REGISTERED_PUSH_NOTIFICATIONS" }
  | { type: "SKIPPED_PUSH_NOTIFICATIONS" }
  | { type: "SEEN_ALL_NOTIFICATIONS" }
  | { type: "RESET_NUXES" };

export type Dispatch = (
  action: Action | ThunkAction | PromiseAction | Array<Action>
) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
