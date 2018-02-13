import * as actions from "../actions";

import groupBy from "lodash/groupBy";

const byId = (state = {}, action) => {
	switch (action.type) {
		case actions.ITEMS_UPDATE_SUCCESS:
			return action.response.data.reduce((acc, item) => {
				const oldState = state[item.id] ? state[item.id] : {};
				acc[item.id] = {
					isFavourite: false,
					oldState,
					...item
				};
				return acc;
			}, {});

		case actions.ITEM_TOGGLE_FAVOURITE:
			const id = action.payload;
			const item = state[id];
			const updatedItem = {
				...item,
				isFavourite: !item.isFavourite
			};
			console.log({ updatedItem });
			return {
				...state,
				[id]: updatedItem
			};
		default:
			return state;
	}
};
const items = (state = [], action) => {
	switch (action.type) {
		case actions.ITEMS_UPDATE_SUCCESS:
			return {
				allIds: action.response.data,
				byCategoryId: groupBy(
					action.response.data,
					item => item.category_id
				),
				byId: byId(state.byId, action)
			};
		case actions.ITEM_TOGGLE_FAVOURITE:
			return {
				...state,
				byId: byId(state.byId, action)
			};
		default:
			return state;
	}
};

export default items;
