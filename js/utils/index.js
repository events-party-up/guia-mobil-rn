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

export const distanceToUser = (item, userLocation) => {
  return Math.random() * 10;
};

export const SORT_AZ = 0;
export const SORT_POPULAR = 1;
export const SORT_PRICE = 2;
export const SORT_DISTANCE = 3;

export const itemsSorter = {
  [SORT_AZ]: () => (item1, item2) =>
    item1.name.toLowerCase().localeCompare(item2.name.toLowerCase()),

  [SORT_POPULAR]: () => (item1, item2) => item1.rating > item2.rating,
  [SORT_PRICE]: () => (item1, item2) => item1.price > item2.price,

  [SORT_DISTANCE]: userLocation => (item1, item2) =>
    distanceToUser(item1, userLocation) < distanceToUser(item2, userLocation)
};
