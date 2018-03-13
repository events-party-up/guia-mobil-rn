import turf from "turf";

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

export const computeDistanceBetweenPoints = (fromPoint, toPoint) => {
  const from = turf.point(fromPoint);
  const to = turf.point(toPoint);

  return turf.distance(from, to);
};
