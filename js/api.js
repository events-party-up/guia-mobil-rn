export const getItems = lastUpdate => {
	return;
};

export const getCategories = lastUpdate => {
	return apiClient.get("update/categories/0").then(res => {
		const categoryList = res.data.nav;
		return categoryList;
	});
};
