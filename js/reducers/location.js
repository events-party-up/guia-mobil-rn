import * as actions from "../actions";

const location = (state = { loaded: false }, action) => {
  switch (action.type) {
    case actions.LOCATION_UPDATE:
      return {
        loaded: true,
        coords: action.coords,
        lastUpdate: Date.now()
      };
    default:
      return state;
  }
};

export default location;
