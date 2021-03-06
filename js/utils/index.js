// @flow
import { Platform } from "react-native";
import { IItem } from "../models";
import * as fromMaps from "./maps";

export * from "./toggleFavorite";

export * from "./maps";

export const IS_ANDROID = Platform.OS === "android";
export const DEFAULT_CENTER_COORDINATE = [-71.3111203, -41.1339525];

export function parseCoordinate(coordinateStr: string): number[] {
  return coordinateStr
    .replace(/[\)\(]/g, "")
    .split(",")
    .map(item => parseFloat(item, 10))
    .reverse();
}

export function parseChars(chars: ?string): number[] {
  if (chars) {
    const stringItems = chars.split(",");
    if (stringItems.length) {
      return stringItems.map(char => parseInt(char, 10));
    }
  }
  return [];
}

export function itemToGeoJSONPoint(item: IItem) {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: item.coord },
    properties: { ...item, icon: "marker" }
  };
}

export const getImageUrl = (image: string) =>
  `https://bariloche.guiasmoviles.com/uploads/${image}`;

export const distanceToUser = (
  item: IItem,
  userLocation: { latitude: number, longitude: number }
) => {
  return fromMaps.computeDistanceBetweenPoints(item.coord, [
    userLocation.longitude,
    userLocation.latitude
  ]);
};

export const SORT_AZ = 0;
export const SORT_POPULAR = 1;
export const SORT_PRICE = 3;
export const SORT_DISTANCE = 2;

export const itemsSorter = {
  [SORT_AZ]: () => (item1, item2) =>
    item1.name.toLowerCase().localeCompare(item2.name.toLowerCase()),

  [SORT_POPULAR]: () => (item1, item2) => item1.rating - item2.rating,

  [SORT_PRICE]: () => (item1, item2) => item1.price - item2.price,
  [SORT_DISTANCE]: userLocation => (item1, item2) =>
    distanceToUser(item1, userLocation) - distanceToUser(item2, userLocation)
};
