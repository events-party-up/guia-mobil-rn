import * as actions from "../actions";

const initialState = { lastUpdate: new Date(), status: null };

const weather = (state = initialState, action) => {
    switch (action.type) {
        case actions.WEATHER_STATUS_UPDATE_SUCCESS:
            return {
                lastUpdate: new Date(),
                status: action.response.data
            };
        default:
            return state;
    }
};

export default weather;
