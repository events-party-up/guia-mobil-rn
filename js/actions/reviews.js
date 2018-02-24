export const ADD_ITEM_REVIEW = "ADD_ITEM_REVIEW";
export const ADD_ITEM_REVIEW_SUCCESS = "ADD_ITEM_REVIEW_SUCCESS";
export const ADD_ITEM_REVIEW_FAILURE = "ADD_ITEM_REVIEW_FAILURE";

export const reviewItem = (itemId, review) => ({
	type: ADD_ITEM_REVIEW,
	apiCall: (apiClient, { itemId, review }, getState) => {
		const { auth } = getState();
		const { id, comment, starRating, priceRating } = review;
		// TODO: refactor this,
		// use state selectors instead
		const userName = `${auth.userProfile.firstName} ${
			auth.userProfile.lastName
		}`;
		const profilePic = auth.userProfile.profilePic;
		const userId = auth.userProfile.id;
		return apiClient.post("/review/post", {
			item_id: id,
			user_id: userId,
			profile_name: userName,
			profile_img: profilePic,
			stars: starRating,
			price: priceRating,
			rtext: comment,
			uuid: DeviceInfo.getUniqueID()
		});
	},
	payload: {
		itemId,
		review
	}
});