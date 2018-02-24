export const getItems = lastUpdate => {
	
};

export const getCategories = lastUpdate => apiClient.get("update/categories/0").then(res => {
		const categoryList = res.data.nav;
		return categoryList;
	});
