import { normalize } from "normalizr";
import * as schema from "./schema";
import { parseCoordinate } from "../utils";
export const CATEGORY_UPDATE = "CATEGORY_UPDATE";
export const CATEGORY_UPDATE_SUCCESS = "CATEGORY_UPDATE_SUCCESS";
export const CATEGORY_UPDATE_FAILURE = "CATEGORY_UPDATE_FAILURE";
export const categoriesUpdate = options => {
	return {
		type: CATEGORY_UPDATE,
		apiCall: apiClient => {
			return apiClient.get("update/categories/0").then(res => {
				const categoryList = res.data.nav;
				// console.log(
				// 	"normalized response",
				// 	normalize(categoryList, schema.arrayOfCategories)
				// );
				return { data: categoryList };
			});
		},
		options
	};
};
