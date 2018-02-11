import { Platform } from "react-native";

export const IS_ANDROID = Platform.OS === "android";
export const DEFAULT_CENTER_COORDINATE = [-71.310221, -41.133512];
export const SF_OFFICE_COORDINATE = [-122.400021, 37.789085];

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
