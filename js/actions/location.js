export const LOCATION_UPDATE = "LOCATION_UPDATE";

export const userLocationUpdate = coords => ({
  type: LOCATION_UPDATE,
  coords
});
