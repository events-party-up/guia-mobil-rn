import * as actions from "../actions";

const auth = (
	state = {
		isAuthenticated: false
	},
	action
) => {
	switch (action.type) {
		case actions.LOGOUT:
			return {
				isAuthenticated: false
			};
		case actions.SET_FACEBOOK_CREDENTIALS:
			return {
				isAuthenticated: true,
				credentials: action.payload
			};
		case actions.SET_USER_PROFILE:
			return {
				...state,
				userProfile: {
					id: action.payload.id,
					raw: action.payload,
					firstName: action.payload.first_name,
					lastName: action.payload.last_name,
					profilePic: action.payload.picture.data.url
				}
			};
		default:
			return state;
	}
};
export default auth;