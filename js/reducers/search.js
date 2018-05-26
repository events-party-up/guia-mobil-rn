// @flow
import { RECORD_SEARCH_TERM, CLEAR_SERCH_HISTORY } from "../actions";

type SearchRecord = {
  term: string,
  searchDate: Date
};

export type State = {
  recordedSearches: SearchRecord[]
};

const initialState = { recordedSearches: [] };
const chars = (state: State = initialState, action: Object) => {
  switch (action.type) {
    case RECORD_SEARCH_TERM: {
      return {
        recordedSearches: [
          ...state.recordedSearches,
          {
            term: action.payload,
            searchDate: Date.now()
          }
        ]
      };
    }
    case CLEAR_SERCH_HISTORY: {
      return initialState;
    }
    default:
      return state;
  }
};

export default chars;

// selectors
// ===============================

export function getSearchTermsHistory(state: State): SearchRecord[] {
  return state.recordedSearches;
}
