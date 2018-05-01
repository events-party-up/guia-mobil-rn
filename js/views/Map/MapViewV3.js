// @flow
import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { connect } from "react-redux";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import GeoViewport from "@mapbox/geo-viewport";
import SuperCluster from "supercluster";
import { Icon } from "react-native-elements";
import { withTheme } from "styled-components";
import sheet from "../../styles/sheet";
import { IItem } from "../../models";
import { getFilteredItems } from "../../reducers";
import Header from "../../components/Header";
import ItemMapMarker from "../../components/ItemMapMarker";
import { itemToGeoJSONPoint, DEFAULT_CENTER_COORDINATE } from "../../utils";
import { geolocationSettings } from "../../config";

import config from "../../utils/config";

const MAPBOX_VECTOR_TILE_SIZE = 512;
const MAX_ZOOM = 20;
const MIN_ZOOM = 10;
const DEFAULT_ZOOM_LEVEL = 10;
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

export const regionToBoundingBox = region => {
  let lngD;
  if (region.longitudeDelta < 0) lngD = region.longitudeDelta + 360;
  else lngD = region.longitudeDelta;

  return [
    region.longitude - lngD, // westLng - min lng
    region.latitude - region.latitudeDelta, // southLat - min lat
    region.longitude + lngD, // eastLng - max lng
    region.latitude + region.latitudeDelta // northLat - max lat
  ];
};

type RegionFeature = {
  properties: {
    isUserInteraction: boolean,
    animated: boolean,
    pitch: number,
    visibleBounds: [number[], number[]],
    heading: number,
    zoomLevel: number
  },
  geometry: {
    coordinates: number[],
    type: "Point"
  },
  type: "Feature"
};

type State = {
  pointsLoaded: boolean,
  accuracy?: number,
  heading?: number,
  altitudeAccuracy?: number,
  latitude?: number,
  speed?: number,
  altitude?: number,
  longitude?: number,
  clusteredItems: ?any,
  errorInUserLocation: ?string,
  selectedItem: ?Object,
  userLocationLoaded: boolean
};

type Props = {
  items: ?Array<IItem>,
  theme: Object,
  navigator: Object
};

const getItemId = item =>
  item.properties.cluster
    ? `cluster_${item.properties.cluster_id}`
    : `point_${item.properties.id}`;

class MapView extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Map",
    gesturesEnabled: false // no gestures on mapa
  };

  constructor(props) {
    super(props);
    this.dimensions = [WINDOW_WIDTH, WINDOW_HEIGHT];
  }

  state: State = {
    userLocationLoaded: false,
    clusteredItems: [],
    pointsLoaded: false,
    errorInUserLocation: null,
    selectedItem: null,
    region: []
  };

  componentDidMount() {
    this.clusterize(this.props.items);

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { coords } = pos;

        this.setState({
          ...coords,
          errorInUserLocation: null,
          userLocationLoaded: true
        });
      },
      error => {
        this.setState({ errorInUserLocation: error.message });
      },
      geolocationSettings
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.items !== nextProps.items) this.clusterize(nextProps.items);
  }

  onDidFinishLoadingStyle = async () => {
    const bounds = GeoViewport.bounds(
      DEFAULT_CENTER_COORDINATE,
      12,
      [WINDOW_WIDTH, WINDOW_HEIGHT],
      MAPBOX_VECTOR_TILE_SIZE
    );

    const options = {
      name: config.get("REGION_NAME"),
      styleURL: MapboxGL.StyleURL.Street,
      bounds: [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
      minZoom: 10,
      maxZoom: 20
    };

    MapboxGL.offlineManager.getPacks().then(packs => {
      const missingRegionPack =
        packs.findIndex(
          pack => pack.metadata.name === config.get("REGION_NAME")
        ) < 0;
      if (missingRegionPack) MapboxGL.offlineManager.createPack(options);
    });
    // start download
  };

  onAnnotationSelected = item => {
    this.setState({ selectedItem: item });
    console.log(`item: ${item.id}`);
    console.log("Selected annotation");
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

  onAnnotationDeselected = () => {
    this.setState({ selectedItem: null });
  };

  count: number = 0;
  clustering: Object;
  _map: any;

  onRegionDidChange = (regionFeature: RegionFeature) => {
    const clusteredItems = this.recomputeClusters(regionFeature);
    console.log({ clusteredItems });
    this.setState({ clusteredItems });
    // do other stuff here, nothing for now
  };

  getClusters = region => {
    const bbox = regionToBoundingBox(region);
    const viewport =
      region.longitudeDelta >= 40
        ? { zoom: MIN_ZOOM }
        : GeoViewport.viewport(bbox, this.dimensions);

    return this.index.getClusters(bbox, viewport.zoom);
  };

  recomputeClusters = (regionFeature: RegionFeature) => {
    if (!regionFeature) return undefined;

    const { properties } = regionFeature;

    const [northLat, eastLong] = properties.visibleBounds[0];
    const [southLat, westLong] = properties.visibleBounds[1];
    const clustersItems = this.index.getClusters(
      [southLat, westLong, northLat, eastLong],
      Math.floor(properties.zoomLevel)
    );
    return clustersItems;
  };

  clusterize = dataset => {
    this.index = SuperCluster({
      // eslint-disable-line new-cap
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      radius: WINDOW_WIDTH * 0.045 // 4.5% of screen width
    });

    // get formatted GeoPoints for cluster
    const rawData = dataset.map(itemToGeoJSONPoint);

    // load geopoints into SuperCluster
    this.index.load(rawData);

    // const clusteredItems = this.getClusters(this.state.region);
    // this.setState({ clusteredItems });
  };

  renderItems = () => {
    const { clusteredItems, selectedItem } = this.state;
    const selectedItemId = selectedItem ? getItemId(selectedItem) : "";

    if (clusteredItems) {
      return clusteredItems.map(item => {
        const id = getItemId(item);
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
          markerView = (
            <ItemMapMarker
              icon={item.properties.iconCode}
              isActive={selectedItemId === id}
            />
          );
        }
        return (
          <MapboxGL.PointAnnotation
            key={id}
            id={`${item.properties.id}`}
            coordinate={item.geometry.coordinates}
            onSelected={() => this.onAnnotationSelected(item)}
            onDeselected={() => this.onAnnotationDeselected()}
            anchor={{ x: 0.5, y: 1.0 }}
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

  centerOnUser = () => {
    const { latitude, longitude, error, userLocationLoaded } = this.state;
    if (!error && userLocationLoaded)
      this._map.flyTo([longitude, latitude], 2000);
  };

  showFiltersModal = () => {
    this.props.navigator.navigate("FiltersModal");
  };

  renderUserLocationMarker() {
    const { altitude, longitude, error, userLocationLoaded } = this.state;
    if (error || !userLocationLoaded) return null;
    return (
      <MapboxGL.PointAnnotation
        id="user-location-marker"
        coordinate={[longitude, altitude]}
      >
        <View style={{ width: 50, height: 50, backgroundColor: "yellow" }} />
      </MapboxGL.PointAnnotation>
    );
  }

  render() {
    const { theme, navigator } = this.props;
    const { errorInUserLocation, userLocationLoaded } = this.state;
    return (
      <View style={styles.container}>
        <Header
          title="Mapa"
          navItem={{
            back: true,
            onPress: () => navigator.pop()
          }}
          itemsColor="white"
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
        />
        <MapboxGL.MapView
          styleURL={MapboxGL.StyleURL.Street}
          style={[
            sheet.matchParent,
            { width: WINDOW_WIDTH, height: WINDOW_HEIGHT }
          ]}
          onRegionDidChange={this.onRegionDidChange}
          onDidFinishLoadingMap={this.onDidFinishLoadingStyle}
          centerCoordinate={DEFAULT_CENTER_COORDINATE}
          zoomLevel={DEFAULT_ZOOM_LEVEL}
          ref={c => {
            this._map = c;
          }}
          maxZoom={MAX_ZOOM}
          minZoom={MIN_ZOOM}
          showUserLocation
        >
          {this.renderItems()}
          {this.renderUserLocationMarker()}
        </MapboxGL.MapView>
        <View style={styles.bottomView}>
          <Icon
            raised
            reverse
            name="my-location"
            type="material-icons"
            color={theme.colors.primary}
            onPress={this.centerOnUser}
            containerStyle={{
              opacity:
                errorInUserLocation !== null || !userLocationLoaded ? 0.5 : 1.0
            }}
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
            onPress={this.showFiltersModal}
          />
        </View>
      </View>
    );
  }
}

MapView.navigatorStyle = { navBarHidden: true };

const mapStateToProps = state => ({
  items: getFilteredItems(state)
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
