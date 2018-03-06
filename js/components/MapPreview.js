// @flow
import React from "react";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import ItemMapMarker from "./ItemMapMarker";
import { Dimensions, StyleSheet } from "react-native";

const WINDOW_WIDTH = Dimensions.get("window").width;

type Props = {
  id: number,
  marker: number[]
};

const MapPreview = ({ id, marker }: Props) => (
  <MapboxGL.MapView
    style={styles.map}
    textureMode
    styleURL={MapboxGL.StyleURL.Street}
    centerCoordinate={marker}
    zoomLevel={14}
    height={200}
    zoomEnabled={false}
    scrollEnabled={false}
    rotateEnabled={false}
  >
    <MapboxGL.PointAnnotation
      id={`${id}`}
      coordinate={marker}
      anchor={{ x: 0.5, y: 1.0 }}
    >
      <ItemMapMarker />
    </MapboxGL.PointAnnotation>
  </MapboxGL.MapView>
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
