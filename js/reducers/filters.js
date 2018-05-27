// @flow
export const TOGGLE_EAT_FILTER = "TOGGLE_EAT_FILTER";
export const TOGGLE_SLEEP_FILTER = "TOGGLE_SLEEP_FILTER";
export const TOGGLE_ACTIVITY_FILTER = "TOGGLE_ACTIVITY_FILTER";
export const TOGGLE_SERVICES_FILTER = "TOGGLE_SERVICES_FILTER";

export const RESET_FILTERS = "RESET_FILTERS";

const EAT_CATEGORIES_ID = 30;
const SLEEP_CATEGORIES_ID = 1;
const TODO_CATEGORIES_ID = 36;
const SERVICES_CATEGORIES_ID = 46;

export type Filters = {
  sleep: boolean,
  eat: boolean,
  services: boolean,
  activities: boolean
};

const categoryIdMap = {
  sleep: SLEEP_CATEGORIES_ID,
  eat: EAT_CATEGORIES_ID,
  services: SERVICES_CATEGORIES_ID,
  activities: TODO_CATEGORIES_ID
};

const initialState: Filters = {
  sleep: false,
  eat: false,
  services: false,
  activities: true
};

const filters = (state: Filters = initialState, action) => {
  switch (action.type) {
    case RESET_FILTERS:
      return initialState;
    case TOGGLE_EAT_FILTER:
      return {
        ...state,
        eat: !state.eat
      };
    case TOGGLE_SLEEP_FILTER:
      return {
        ...state,
        sleep: !state.sleep
      };
    case TOGGLE_ACTIVITY_FILTER:
      return {
        ...state,
        activities: !state.activities
      };
    case TOGGLE_SERVICES_FILTER:
      return {
        ...state,
        services: !state.services
      };
    default:
      return state;
  }
};

export default filters;

export const getActiveCategories = (state: Filters) =>
  Object.keys(state).reduce((acc, key) => {
    if (state[key]) {
      return [...acc, categoryIdMap[key]];
    }
    return acc;
  }, []);
