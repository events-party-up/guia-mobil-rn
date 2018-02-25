export const CATEGORY_UPDATE = "CATEGORY_UPDATE";
export const CATEGORY_UPDATE_SUCCESS = "CATEGORY_UPDATE_SUCCESS";
export const CATEGORY_UPDATE_FAILURE = "CATEGORY_UPDATE_FAILURE";

export const categoriesUpdate = options => ({
  type: CATEGORY_UPDATE,
  apiCall: apiClient =>
    apiClient.get("update/categories/0").then(res => {
      const categoryList = res.data.nav;
      return { data: categoryList };
    }),
  options
});
