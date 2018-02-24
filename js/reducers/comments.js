import * as actions from "../actions";

const count = 0;
const addComment = (state = [], action) => {
	switch (action.type) {
		case actions.ITEM_ADD_COMMENT:
			const { comment, starRating, priceRating } = action.payload;
			return [
				...state,
				{
					id: count++,
					text: comment,
					starRating,
					priceRating,
					created: new Date()
				}
			];
		default:
			return state;
	}
};

const comments = (state = {}, action) => {
	switch (action.type) {
		case actions.ITEM_ADD_COMMENT:
			const itemId = action.payload.id;
			return { ...state, [itemId]: addComment(state[itemId], action) };
		default:
			return state;
	}
};
export default comments;
