import axios from "axios";
export const SET_FACEBOOK_CREDENTIALS = "SET_FACEBOOK_CREDENTIALS";
export const SET_USER_PROFILE = "SET_USER_PROFILE";

export const setFacebookCredentials = credentials => {
	return dispatch => {
		dispatch({
			type: SET_FACEBOOK_CREDENTIALS,
			payload: credentials
		});

		const userId = credentials.userId;
		const accessToken = credentials.token;
		axios
			.get(
				`https://graph.facebook.com/v2.12/${userId}?fields=first_name,last_name,picture&access_token=${accessToken}`
			)
			.then(res => {
				console.log({ facebookData: res.data });

				dispatch({
					type: SET_USER_PROFILE,
					payload: res.data
				});
			})
			.catch(err => {
				console.log({ err });
			});
	};
};

export const LOGOUT = "LOGOUT";
export const logout = () => {
	return {
		type: LOGOUT
	};
};
