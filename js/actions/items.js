import { parseCoordinate } from "../utils";

export const ITEMS_UPDATE = "ITEMS_UPDATE";
export const ITEMS_UPDATE_SUCCESS = "ITEMS_UPDATE_SUCCESS";
export const ITEMS_UPDATE_FAILURE = "ITEMS_UPDATE_FAILURE";

export const ITEM_TOGGLE_FAVOURITE = "ITEM_TOGGLE_LIKE";

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
