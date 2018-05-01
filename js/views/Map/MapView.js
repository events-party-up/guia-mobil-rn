// @flow
import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { connect } from "react-redux";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import GeoViewport from "@mapbox/geo-viewport";
import { Icon } from "react-native-elements";
import { withTheme } from "styled-components";
import sheet from "../../styles/sheet";
import { IItem } from "../../models";
import { getFilteredItems, getFavoriteItemsIds } from "../../reducers";
import Header from "../../components/Header";
import ItemCallout from "../../components/ItemCallout";
import { itemToGeoJSONPoint, DEFAULT_CENTER_COORDINATE } from "../../utils";
import { geolocationSettings } from "../../config";
import getRealm from "../../database";
import config from "../../utils/config";
import IconButton from "../../components/common/IconButton";

const markerIcon = require("./img/marker.png");

const MAPBOX_VECTOR_TILE_SIZE = 512;
const DEFAULT_ZOOM_LEVEL = 10;
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

function transformIconCode(item) {
  return {
    ...item,
    iconCode: String.fromCharCode(parseInt(item.iconCode, 16))
  };
}

type State = {
  accuracy?: number,
  heading?: number,
  altitudeAccuracy?: number,
  latitude?: number,
  speed?: number,
  altitude?: number,
  longitude?: number,
  errorInUserLocation?: string,
  selectedItemId: ?number,
  userLocationLoaded: boolean,
  pointCollection: {},
  itemsDataPreload: {}
};

type Props = {
  items: Array<IItem>,
  theme: Object,
  navigator: Object,
  favoritesIds: number[]
};

/* eslint-disable  no-underscore-dangle */

class MapView extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Map",
    gesturesEnabled: false // no gestures on mapa
  };

  static navigatorStyle = { navBarHidden: true, tabBarHidden: true };

  constructor(props: Props) {
    super(props);
    this.state = {
      userLocationLoaded: false,
      itemsDataPreload: {},
      pointCollection: this.buildFeautureCollection(this.props.items),
      selectedItemId: null
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { coords } = pos;

        this.setState({
          ...coords,
          errorInUserLocation: "",
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
    if (this.props.items !== nextProps.items) {
      this.setState({
        pointCollection: this.buildFeautureCollection(nextProps.items)
      });
    }
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

  onItemPress = async (evt: {
    nativeEvent: {
      payload: {
        properties: any
      }
    }
  }) => {
    // evt.type  =shapesourcelayerpress
    const {
      id
    }: // iconCode,
    // coord,
    // category_id,
    // rootCategoryId
    IItem = evt.nativeEvent.payload.properties;
    this.setState({ selectedItemId: id });
    this.loadDataForItem(id);
  };

  birdView = () => {
    this._map.setCamera({
      centerCoordinate: DEFAULT_CENTER_COORDINATE,
      zoom: DEFAULT_ZOOM_LEVEL,
      duration: 2000
    });
  };
  _map: any;

  centerOnUser = () => {
    const {
      latitude,
      longitude,
      errorInUserLocation,
      userLocationLoaded
    } = this.state;
    if (!errorInUserLocation && userLocationLoaded)
      this._map.flyTo([longitude, latitude], 2000);
  };

  buildFeautureCollection = (items: (IItem & { iconCode: string })[]) => {
    const features = items.map(transformIconCode).map(itemToGeoJSONPoint);
    console.log({ features });
    const source = {
      type: "FeatureCollection",
      features
    };
    return source;
  };

  showFiltersModal = () => {
    this.props.navigator.showModal({
      screen: "FiltersModal"
    });
  };

  loadDataForItem = async itemId => {
    if (this.state.itemsDataPreload[itemId]) {
      return;
    }
    const realm = await getRealm();
    const item = realm.objects("Item").filtered(`id = ${itemId}`)[0];
    const isFavorite = this.props.favoritesIds.indexOf(item.id) >= 0;
    if (item) {
      this.setState({
        itemsDataPreload: {
          ...this.state.itemsDataPreload,
          [itemId]: { ...item, isFavorite }
        }
      });
    }
  };

  renderUserLocationMarker() {
    const {
      altitude,
      longitude,
      errorInUserLocation,
      userLocationLoaded
    } = this.state;
    if (errorInUserLocation || !userLocationLoaded) return null;
    return (
      <MapboxGL.PointAnnotation
        id="user-location-marker"
        coordinate={[longitude, altitude]}
      >
        <View style={{ width: 50, height: 50, backgroundColor: "yellow" }} />
      </MapboxGL.PointAnnotation>
    );
  }

  clearSelectedItem = () => {
    this.setState(
      // eslint-disable-line
      { selectedItemId: null }
    );
  };
  render() {
    const { theme, navigator } = this.props;
    const {
      errorInUserLocation,
      userLocationLoaded,
      itemsDataPreload,
      selectedItemId
    } = this.state;
    return (
      <View style={styles.container}>
        <Header
          title="Mapa"
          navItem={{ back: true, onPress: () => navigator.pop() }}
          itemsColor="white"
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
        />
        <MapboxGL.MapView
          style={[
            sheet.matchParent,
            { width: WINDOW_WIDTH, height: WINDOW_HEIGHT }
          ]}
          localizeLabels
          onRegionWillChange={this.clearSelectedItem}
          centerCoordinate={DEFAULT_CENTER_COORDINATE}
          zoomLevel={DEFAULT_ZOOM_LEVEL}
          showUserLocation
          ref={c => (this._map = c)}
          onPress={this.clearSelectedItem}
        >
          <MapboxGL.ShapeSource
            id="exampleShapeSource"
            shape={this.state.pointCollection}
            images={{ marker: markerIcon }}
            onPress={this.onItemPress}
          >
            <MapboxGL.SymbolLayer id="exampleIconName" style={mapStyles.icon} />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
        {selectedItemId && (
          <View style={styles.calloutViewContainer}>
            <ItemCallout
              isFavorite={this.props.favoritesIds.indexOf(selectedItemId) >= 0}
              navigator={this.props.navigator}
              itemData={itemsDataPreload[selectedItemId]}
            />
          </View>
        )}
        <View style={styles.bottomView}>
          <IconButton
            imageSource={require("./img/my-location-icon.png")}
            onPress={this.centerOnUser}
          />
          <IconButton
            imageSource={require("./img/center-focus-icon.png")}
            onPress={this.birdView}
          />
          <IconButton
            imageSource={require("./img/filter-icon.png")}
            onPress={this.showFiltersModal}
          />
        </View>
      </View>
    );
  }
}
/* eslint-enable  no-underscore-dangle */

const mapStateToProps = state => ({
  items: getFilteredItems(state),
  favoritesIds: getFavoriteItemsIds(state)
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
    marginBottom: 20,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  calloutViewContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "transparent",
    flexDirection: "row"
  }
});

const mapStyles = MapboxGL.StyleSheet.create({
  icon: {
    iconImage: "{icon}",
    iconSize: MapboxGL.StyleSheet.source(
      [["marker", 0.1], ["airport-15", 1.2]],
      "icon",
      MapboxGL.InterpolationMode.Categorical
    ),
    textField: "{iconCode}"
  }
});
