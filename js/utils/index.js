import { Platform } from "react-native";

export const IS_ANDROID = Platform.OS === "android";
export const DEFAULT_CENTER_COORDINATE = [-71.3111203, -41.1339525];

export function parseCoordinate(coordinateStr) {
	return coordinateStr
		.replace(/[\)\(]/g, "")
		.split(",")
		.map(item => parseFloat(item, 10))
		.reverse();
}

export function onSortOptions(a, b) {
	if (a.label < b.label) {
		return -1;
	}

	if (a.label > b.label) {
		return 1;
	}

	return 0;
}

export function itemToGeoJSONPoint(item) {
	return {
		type: "Feature",
		geometry: {
			type: "Point",
			coordinates: item.coord
		},
		properties: item
	};
}

export const getImageUrl = (image: string) =>
	`https://bariloche.guiasmoviles.com/uploads/${image}`;
