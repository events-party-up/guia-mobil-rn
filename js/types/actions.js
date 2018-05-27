// @flow

import type { FacebookProfileData, GoogleProfileData } from "../actions";

// search actions
export type RecordSearchTermAction = {
  +type: "RECORD_SEARCH_TERM",
  payload: string
};

export type ClearSearchHistoryAction = {
  +type: "CLEAR_SERCH_HISTORY"
};

// auth actions

export type LogoutAction = {
  +type: "LOGOUT"
};

export type SetFacebookCredentialsAction = {|
  +type: "SET_FACEBOOK_CREDENTIALS",
  credentials: { userId: string, token: string },
  profile: FacebookProfileData
|};

export type SetGoogleCredentialsAction = {|
  +type: "SET_GOOGLE_CREDENTIALS",
  credentials: { userId: string, token: string },
  profile: GoogleProfileData
|};

// categories

export type CategoryUpdateAction = {
  +type: "CATEGORY_UPDATE",
  apiCall: Function,
  options: Object
};

// filters

export type ResetFiltersAction = {
  +type: "RESET_FILTERS"
};

// items
export type ItemsUpdateAction = {
  +type: "ITEMS_UPDATE",
  apiCall: Function,
  options: Object
};

export type FeaturedItemsUpdateAction = {
  +type: "ITEMS_UPDATE_FEATURED",
  apiCall: Function,
  options: Object
};

// notifications

export type LoadNotificationsAction = {
  +type: "LOAD_NOTIFICATIONS",
  apiCall: Function,
  options: Object
};

export type ReceivedPushAction = {
  +type: "RECEIVED_PUSH_NOTIFICATION",
  notification: Object
};

export type SeenNotificationAction = {
  +type: "NOTIFICATION_SEEN",
  notificationId: string
};

// this is the action type
export type Action =
  | RecordSearchTermAction
  | ClearSearchHistoryAction
  | LogoutAction
  | SetFacebookCredentialsAction
  | SetGoogleCredentialsAction
  | CategoryUpdateAction
  | ResetFiltersAction
  | LoadNotificationsAction
  | ReceivedPushAction
  | SeenNotificationAction;
