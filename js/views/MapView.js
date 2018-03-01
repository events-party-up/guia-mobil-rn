// @flow
import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { connect } from "react-redux";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import geoViewport from "@mapbox/geo-viewport";
import supercluster from "supercluster";
import sheet from "../styles/sheet";
import { IItem } from "../models";
import { getItems } from "../reducers";
import Header from "../components/Header";
import { withTheme } from "styled-components";
import ItemMapMarker from "../components/ItemMapMarker";
import { Icon } from "react-native-elements";
import {
  onSortOptions,
  itemToGeoJSONPoint,
  DEFAULT_CENTER_COORDINATE
} from "../utils";

import config from "../utils/config";

const MAPBOX_VECTOR_TILE_SIZE = 512;
const MAX_ZOOM = 20;
const MIN_ZOOM = 10;
const DEFAULT_ZOOM_LEVEL = 10;
const WINDOW_WIDTH = Dimensions.get("window").width;

type State = {
  pointsLoaded: boolean,
  clusteredItems: ?any
};

type Props = {
  items: ?Array<IItem>,
  theme: Object
};

class MapView extends React.Component<Props, State> {
  static navigationOptions = { title: "Map" };
  constructor(props) {
    super(props);
    this.clustering = supercluster({
      radius: 30,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM
    });
    this.state = {
      pointsLoaded: false,
      clusteredItems: []
    };
  }
  clustering: any;
  _map: any;
  count: number = 0;

  componentDidMount() {
    this.setItems(this.props.items);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setItems(nextProps.items);
  }
  onDownloadProgress = () => {
    console.log("donwload is progressing");
  };
  async onDidFinishLoadingStyle() {
    console.log("styles loaded");
    const { width, height } = Dimensions.get("window");
    const bounds = geoViewport.bounds(
      DEFAULT_CENTER_COORDINATE,
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

  onAnnotationSelected = item => {
    if (item.properties.cluster) {
      const zoom = this.clustering.getClusterExpansionZoom(
        item.properties.cluster_id
      );
      this._map.setCamera({
        centerCoordinate: item.geometry.coordinates,
        zoom
      });
    }
  };

  setItems = items => {
    if (items) {
      const geoJSONItems = items.map(itemToGeoJSONPoint);
      console.log("!!!! loading points");
      this.clustering.load(geoJSONItems);

      this.setState({ pointsLoaded: true });
    }
  };

  recomputeClusters = regionFeature => {
    if (!regionFeature) return undefined;
    const { pointsLoaded } = this.state;
    if (pointsLoaded) {
      const { properties } = regionFeature;

      const [northLat, eastLong] = properties.visibleBounds[0];
      const [southLat, westLong] = properties.visibleBounds[1];
      const clustersItems = this.clustering.getClusters(
        [southLat, westLong, northLat, eastLong],
        Math.floor(properties.zoomLevel)
      );
      return clustersItems;
    }
    return [];
  };

  onRegionDidChange = regionFeature => {
    console.log("count", this.count++);
    const clusteredItems = this.recomputeClusters(regionFeature);
    this.setState({ clusteredItems });
    // do other stuff here, nothing for now
  };

  renderItems = () => {
    const { clusteredItems } = this.state;
    console.log({ clusteredItems });
    if (clusteredItems) {
      return clusteredItems.map(item => {
        const id = item.properties.cluster
          ? `cluster_${item.properties.cluster_id}`
          : `point_${item.properties.id}`;

        let markerView;
        if (item.properties.cluster) {
          markerView = (
            <View style={styles.annotationContainer}>
              <View style={styles.annotationFill}>
                {item.properties.cluster ? (
                  <Text>{item.properties.point_count}</Text>
                ) : null}
              </View>
            </View>
          );
        } else {
          markerView = <ItemMapMarker icon={item.properties.iconCode} />;
        }
        return (
          <MapboxGL.PointAnnotation
            key={id}
            pitchEnabled={false}
            showUserLocation
            id={`${item.properties.id}`}
            coordinate={item.geometry.coordinates}
            onSelected={() => this.onAnnotationSelected(item)}
            maxZoom={MAX_ZOOM}
            minZoom={MIN_ZOOM}
          >
            {markerView}
            <MapboxGL.Callout title="Look! An annotation!" />
          </MapboxGL.PointAnnotation>
        );
      });
    }
    return null;
  };

  birdView = () => {
    this._map.setCamera({
      centerCoordinate: DEFAULT_CENTER_COORDINATE,
      zoom: DEFAULT_ZOOM_LEVEL,
      duration: 2000
    });
  };

  render() {
    const { theme, navigation } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title={"Mapa"}
          navItem={{
            back: true,
            onPress: () => navigation.goBack(null)
          }}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
        />
        <MapboxGL.MapView
          styleURL={MapboxGL.StyleURL.Street}
          style={[sheet.matchParent, { width: WINDOW_WIDTH }]}
          onRegionDidChange={this.onRegionDidChange}
          onDidFinishLoadingMap={this.onDidFinishLoadingStyle}
          centerCoordinate={DEFAULT_CENTER_COORDINATE}
          zoomLevel={DEFAULT_ZOOM_LEVEL}
          ref={c => (this._map = c)}
        >
          {this.renderItems()}
        </MapboxGL.MapView>
        <View style={styles.bottomView}>
          <Icon
            raised
            reverse
            name="my-location"
            type="material-icons"
            color={theme.colors.primary}
            onPress={() => console.log("hello")}
          />
          <Icon
            raised
            reverse
            name="center-focus-weak"
            type="material-icons"
            color={theme.colors.primary}
            onPress={this.birdView}
          />
          <Icon
            raised
            reverse
            name="filter"
            type="feather"
            color={theme.colors.primary}
            onPress={() => console.log("hello")}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  items: getItems(state)
});

export default withTheme(connect(mapStateToProps)(MapView));

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
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
  },
  bottomView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around"
  }
});
