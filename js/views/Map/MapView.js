// @flow
import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { connect } from "react-redux";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import geoViewport from "@mapbox/geo-viewport";
import supercluster from "supercluster";
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

type State = {
  pointsLoaded: boolean,
  accuracy?: number,
  altitude?: number,
  longitude?: number,
  clusteredItems: ?any,
  error: ?string,
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
    this.clustering = supercluster({
      radius: 30,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM
    });
  }

  state: State = {
    userLocationLoaded: false,
    clusteredItems: [],
    pointsLoaded: false,
    error: null,
    selectedItem: null
  };

  componentDidMount() {
    this.setItems(this.props.items);

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { coords } = pos;
        console.log({ coords });
        this.setState({
          ...coords,
          error: null,
          userLocationLoaded: true
        });
      },
      error => {
        this.setState({ error: error.message });
      },
      geolocationSettings
    );
  }

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
    MapboxGL.offlineManager.getPacks().then(packs => {
      const missingRegionPack =
        packs.findIndex(
          pack => pack.metadata.name === config.get("REGION_NAME")
        ) < 0;
      if (missingRegionPack)
        MapboxGL.offlineManager.createPack(options, this.onDownloadProgress);
    });
    // start download
  }

  onAnnotationSelected = item => {
    this.setState({ selectedItem: item });
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

  setItems = items => {
    if (items) {
      const geoJSONItems = items.map(itemToGeoJSONPoint);
      console.log("!!!! loading points");
      this.clustering.load(geoJSONItems);
      this.setState({ pointsLoaded: true });
    }
  };

  count: number = 0;
  clustering: Object;
  _map: any;

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
    const { clusteredItems, selectedItem } = this.state;
    const selectedItemId = selectedItem ? getItemId(selectedItem) : "";

    console.log({ selectedItemId });

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
              isActive={selectedItemId === item.properties.id}
            />
          );
        }
        return (
          <MapboxGL.PointAnnotation
            key={id}
            id={`${item.properties.id}`}
            selected={selectedItemId === id}
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
    const { altitude, longitude, error, userLocationLoaded } = this.state;
    if (!error && userLocationLoaded)
      this._map.flyTo([longitude, altitude], 2000);
  };

  showFiltersModal = () => {
    this.props.navigator.navigate("FiltersModal");
  };

  render() {
    const { theme, navigator } = this.props;
    const { error, userLocationLoaded } = this.state;
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
              opacity: error !== null || !userLocationLoaded ? 0.5 : 1.0
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
