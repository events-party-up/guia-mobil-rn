// @flow

export const RECORD_SEARCH_TERM = "RECORD_SEARCH_TERM";

export const recordSearchTerm = (term: string) => ({
  type: RECORD_SEARCH_TERM,
  payload: term
});

export const CLEAR_SERCH_HISTORY = "CLEAR_SERCH_HISTORY";

export const clearHistory = () => ({
  type: CLEAR_SERCH_HISTORY
});
