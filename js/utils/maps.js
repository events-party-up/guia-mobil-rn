// @flow
import turf from "turf";
import { Platform, Linking } from "react-native";

export const toLatLong = coordArr => ({
  latitude: coordArr[1],
  longitude: coordArr[0]
});

export const getAppleMapsUri = (from, to) =>
  `http://maps.apple.com/maps?saddr=${from.latitude},${from.longitude}&daddr=${
    to.latitude
  },${to.longitude}`;

export const getGoogleMapsUri = (from, to) =>
  `http://maps.google.com/maps?saddr=${from.latitude},${from.longitude}&daddr=${
    to.latitude
  },${to.longitude}`;

export const computeDistanceBetweenPoints = (
  fromPoint: number[],
  toPoint: number[]
) => {
  if (!Array.isArray(toPoint)) {
    throw new Error(
      `This does not look as an array to me ${JSON.stringify(toPoint)}`
    );
  }
  //longitude, latitude
  const from = turf.point(fromPoint);
  const to = turf.point(toPoint);

  return turf.distance(from, to);
};

export const openRouteToItem = (coord: number[], userLocation: number[]) => {
  let uri: string;
  if (Platform.OS === "ios") {
    uri = getAppleMapsUri(toLatLong(coord), toLatLong(userLocation));
  } else {
    uri = getGoogleMapsUri(toLatLong(coord), toLatLong(userLocation));
  }
  Linking.openURL(uri).catch(err =>
    console.error("An error occurred opening maps", err)
  );
};
