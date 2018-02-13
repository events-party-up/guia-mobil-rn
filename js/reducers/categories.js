import * as actions from "../actions";

const categories = (state = [], action) => {
	switch (action.type) {
		case actions.CATEGORY_UPDATE_SUCCESS:
			return action.response.data;
		default:
			return state;
	}
};

export default categories;
