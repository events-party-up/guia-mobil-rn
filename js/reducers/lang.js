import * as actions from "../actions";

const initalState = {
  code: "es-ES",
  name: "Español"
};

const lang = (state = initalState, action) => {
  switch (action.type) {
    case actions.SET_UI_LANG:
      return { code: action.code, name: action.name };
    default:
      return state;
  }
};

export default lang;
