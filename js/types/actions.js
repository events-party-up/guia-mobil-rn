// @flow

import actions from "../actions";
import type { FacebookProfileData, GoogleProfileData } from "../actions";

// search actions
export type RecordSearchTermAction = {
  type: actions.RECORD_SEARCH_TERM,
  payload: string
};

export type ClearSearchHistoryAction = {
  type: actions.CLEAR_SERCH_HISTORY
};

// auth actions

export type LogoutAction = {
  type: actions.LOGOUT
};

export type SetFacebookCredentialsAction = {
  type: actions.SET_FACEBOOK_CREDENTIALS,
  credentials: { userId: string, token: string },
  profile: FacebookProfileData
};

export type SetGoogleCredentialsAction = {
  type: actions.SET_FACEBOOK_CREDENTIALS,
  credentials: { userId: string, token: string },
  profile: GoogleProfileData
};

// categories

export type CategoryUpdateAction = {
  type: actions.CATEGORY_UPDATE,
  apiCall: Function,
  options: Object
};

// filters

export type ResetFiltersAction = {
  type: actions.RESET_FILTERS
};

// items
export type ItemsUpdateAction = {
  type: actions.ITEMS_UPDATE,
  apiCall: Function,
  options: Object
};

export type FeaturedItemsUpdateAction = {
  type: actions.ITEMS_UPDATE_FEATURED,
  apiCall: Function,
  options: Object
};

// filters
