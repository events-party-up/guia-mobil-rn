import React from "react";
import { View, Text, Dimensions } from "react-native";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import geoViewport from "@mapbox/geo-viewport";
import supercluster from "supercluster";

import BaseExamplePropTypes from "./common/BaseExamplePropTypes";
import TabBarPage from "./common/TabBarPage";
import sheet from "../styles/sheet";
import { onSortOptions } from "../utils";
import { DEFAULT_CENTER_COORDINATE } from "../utils";

import { getItems } from "../api";

class ShowMap extends React.Component {
  static propTypes = {
    ...BaseExamplePropTypes
  };
  state = {};

  constructor(props) {
    super(props);
    getItems()
      .then(items => {
        console.log({ items });
        const geoJSONItems = items.map(item => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: item.coord
          },
          properties: item
        }));

        const clustering = supercluster({
          radius: 40,
          maxZoom: 16
        });
        console.log({ geoJSONItems });
        clustering.load(geoJSONItems);

        this.setState({ clustering });
      })
      .catch(err => {
        console.log(err);
      });
  }

  async onDidFinishLoadingStyle() {
    const { width, height } = Dimensions.get("window");
    const bounds = geoViewport.bounds(
      CENTER_COORD,
      12,
      [width, height],
      MAPBOX_VECTOR_TILE_SIZE
    );

    const options = {
      name: config.get("REGION_NAME"),
      styleURL: MapboxGL.StyleURL.Street,
      bounds: [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
      minZoom: 10,
      maxZoom: 20
    };

    // start download
    MapboxGL.offlineManager.createPack(options, this.onDownloadProgress);
  }
  renderItems = () => {
    const { clustering } = this.state;
    if (clustering) {
      const { geometry, properties } = this.state.regionFeature;
      console.log({ geometry }, { properties });

      const [northLat, eastLong] = properties.visibleBounds[0];
      const [southLat, westLong] = properties.visibleBounds[1];
      console.log({ northLat }, { eastLong }, { southLat }, { westLong });
      console.log([westLong, southLat, eastLong, northLat]);
      const clusters = clustering.getClusters(
        [southLat, westLong, northLat, eastLong],
        Math.round(properties.zoomLevel)
      );
      console.log({ clusters });
      // return null;
      return clusters.map(item => {
        return (
          <MapboxGL.PointAnnotation
            key={item.properties.id}
            id={`${item.properties.id}`}
            coordinate={item.geometry.coordinates}
            onSelected={this.onAnnotationSelected}
          >
            <View style={styles.annotationContainer}>
              <View style={styles.annotationFill}>
                {item.properties.cluster ? (
                  <Text>{item.properties.point_count}</Text>
                ) : null}
              </View>
            </View>
            <MapboxGL.Callout title="Look! An annotation!" />
          </MapboxGL.PointAnnotation>
        );
      });
    } else {
      return null;
    }
  };
  onAnnotationSelected = feature => {
    console.log({ feature });
  };

  onRegionDidChange = regionFeature => {
    this.setState({ regionFeature: regionFeature });
  };
  render() {
    return (
      <MapboxGL.MapView
        ref={c => (this._map = c)}
        zoomLevel={12}
        onRegionDidChange={this.onRegionDidChange}
        styleURL={MapboxGL.StyleURL.Street}
        style={sheet.matchParent}
        centerCoordinate={DEFAULT_CENTER_COORDINATE}
        onDidFinishLoadingMap={this.onDidFinishLoadingStyle}
      >
        {this.renderItems()}
      </MapboxGL.MapView>
    );
  }
}

const styles = {
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 15
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "orange",
    transform: [{ scale: 0.6 }],
    alignItems: "center",
    justifyContent: "center"
  },
  annotationText: {
    color: "white",
    backgroundColor: "transparent"
  }
};
export default ShowMap;
