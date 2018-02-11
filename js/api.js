import axios from "axios";
import { parseCoordinate } from "./utils";
var apiClient = axios.create({
	baseURL: "https://bariloche.guiasmoviles.com/",
	timeout: 1000
});

export const getItems = lastUpdate => {
	return apiClient.get("update/items/0").then(res => {
		const itemList = res.data.map(item => ({
			...item,
			coord: parseCoordinate(item.coord)
		}));
		return itemList.filter(item => item.coord.length === 2);
	});
};
