const lang = (state = "es", action) => {
  switch (action.type) {
    case "SET_ACTIVE_LANG":
      return { code: action.code, name: action.name };
    default:
      return state;
  }
};

export default lang;
