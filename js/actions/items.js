import { parseCoordinate } from "../utils";
import DeviceInfo from "react-native-device-info";
export const ITEMS_UPDATE = "ITEMS_UPDATE";
export const ITEMS_UPDATE_SUCCESS = "ITEMS_UPDATE_SUCCESS";
export const ITEMS_UPDATE_FAILURE = "ITEMS_UPDATE_FAILURE";

export const ITEM_TOGGLE_FAVOURITE = "ITEM_TOGGLE_LIKE";
export const ITEM_ADD_COMMENT = "ITEM_ADD_COMMENT";

export const itemsUpdate = options => {
	return {
		type: ITEMS_UPDATE,
		apiCall: apiClient => {
			return apiClient.get("update/items/0").then(res => {
				const itemList = res.data.map(item => ({
					...item,
					coord: parseCoordinate(item.coord)
				}));
				return {
					data: itemList.filter(item => item.coord.length === 2)
				};
			});
		},
		options
	};
};
export const toggleFavourite = id => {
	return {
		type: ITEM_TOGGLE_FAVOURITE,
		payload: id
	};
};

export const commentItem = (id, { comment, starRating, priceRating }) => {
	return {
		type: ITEM_ADD_COMMENT,
		apiCall: (
			apiClient,
			{ id, comment, starRating, priceRating },
			getState
		) => {
			const { auth } = getState();
			return apiClient.post("review/post", {
				item_id: id,
				user_id: auth.id,
				profile_name: auth.name,
				profile_img: auth.profileImg,
				stars: starRating,
				price: priceRating,
				rtext: comment,
				uuid: DeviceInfo.getUniqueID()
			});
		},
		payload: { id, comment, starRating, priceRating }
	};
};
