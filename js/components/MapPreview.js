// @flow
import React from "react";
import MapView, { Marker, ProviderPropType } from "react-native-maps";
import ItemMapMarker from "./ItemMapMarker";
import { Dimensions, StyleSheet } from "react-native";

const WINDOW_WIDTH = Dimensions.get("window").width;

type Props = {
  id: number,
  marker: number[]
};

const MapPreview = ({ id, marker }: Props) => (
  <MapView
    initialRegion={{
      latitude: marker[1],
      longitude: marker[0],
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421
    }}
    zoomEnabled={false}
    rotateEnabled={false}
    scrollEnabled={false}
    style={{ height: 200, width: WINDOW_WIDTH }}
  >
    <Marker coordinate={{ latitude: marker[1], longitude: marker[0] }} />
  </MapView>
);

export default MapPreview;

// styles
// =============================

const styles = StyleSheet.create({
  map: {
    width: WINDOW_WIDTH,
    height: 200
  }
});
