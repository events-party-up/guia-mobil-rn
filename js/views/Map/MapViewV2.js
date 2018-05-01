// @flow
import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { connect } from "react-redux";
// import MapboxGL from "@mapbox/react-native-mapbox-gl";
import { Icon } from "react-native-elements";
import { withTheme } from "styled-components";
import flatten from "lodash/flatten";
import { IItem } from "../../models";
import { getFilteredItems, getFavoriteItemsIds } from "../../reducers";
import Header from "../../components/Header";
// import ItemMapMarker from "../../components/ItemMapMarker";
import ItemCallout from "../../components/ItemCallout";
import { DEFAULT_CENTER_COORDINATE } from "../../utils";
import MapView, { Marker } from "react-native-maps";
import getRealm, { itemsToArray } from "../../database";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = DEFAULT_CENTER_COORDINATE[1];
const LONGITUDE = DEFAULT_CENTER_COORDINATE[0];
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

type State = {
  pointsLoaded: boolean,
  accuracy?: number,
  heading?: number,
  altitudeAccuracy?: number,
  latitude?: number,
  speed?: number,
  altitude?: number,
  longitude?: number,
  userLocationLoaded: boolean,
  itemsDatPreload: any[],
  itemsData: any
};

type Props = {
  items: ?Array<IItem>,
  theme: Object,
  navigator: Object
};

class MapScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Map",
    gesturesEnabled: false // no gestures on mapa
  };

  state: State = {
    userLocationLoaded: false,
    pointsLoaded: false,
    region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    },
    itemsDataPreload: [],
    itemsData: {}
  };

  componentDidMount() {
    const { items, favoritesIds } = this.props;
    getRealm().then(realm => {
      const realmItems = realm.objects("Item");
      const itemsData = flatten(
        items.map(item => itemsToArray(realmItems.filtered(`id = ${item.id}`)))
      ).map(item => ({
        ...item,
        isFavorite: favoritesIds.indexOf(item.id) >= 0
      }));

      this.setState({
        itemsDataPreload: itemsToArray(itemsData),
        pointsLoaded: true
      });
    });
  }

  showFiltersModal = () => {
    this.props.navigator.navigate("FiltersModal");
  };

  loadDataForItem = async itemId => {
    if (this.state.itemsData[itemId]) {
      return;
    }
    const realm = await getRealm();
    console.log("=======", itemId);
    const item = realm.objects("Item").filtered(`id = ${itemId}`)[0];
    console.log(item);
    console.log("=============");
    if (item) {
      this.setState(
        {
          itemsData: { ...this.state.itemsData, [itemId]: item }
        },
        () => {
          this.forceUpdate();
        }
      );
    }
  };

  onRegionChangeComplete = region => {
    let boundingBox = this.getBoundingBox(region);
    this.setState({ region, boundingBox });
  };

  getBoundingBox = region => {
    let boundingBox = {
      westLng: region.longitude - region.longitudeDelta / 2, // westLng - min lng
      southLat: region.latitude - region.latitudeDelta / 2, // southLat - min lat
      eastLng: region.longitude + region.longitudeDelta / 2, // eastLng - max lng
      northLat: region.latitude + region.latitudeDelta / 2 // northLat - max lat
    };

    return boundingBox;
  };

  renderMarkers = () => {
    const { pointsLoaded, itemsDataPreload } = this.state;
    if (!pointsLoaded) {
      return null;
    }
    return this.props.items.map((item, idx) => {
      const { id, category_id, coord, iconCode, rootCategoryId } = item;
      return (
        <Marker
          tracksInfoWindowChanges
          key={id}
          pinColor="#0a71b3"
          onPress={() => this.loadDataForItem(id)}
          coordinate={{ latitude: coord[1], longitude: coord[0] }}
        >
          <ItemCallout
            itemId={id}
            itemData={itemsDataPreload[idx]}
            onPress={() =>
              this.props.navigator.push({
                screen: "animus.ItemDetailsView",
                passProps: {
                  item: itemsDataPreload[idx]
                }
              })
            }
          />
        </Marker>
      );
    });
  };

  render() {
    const { theme, navigator } = this.props;
    const { error, userLocationLoaded, region } = this.state;
    return (
      <View style={styles.container}>
        <Header
          title="Mapa"
          navItem={{ back: true, onPress: () => navigator.pop() }}
          itemsColor="white"
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
        />

        <MapView
          initialRegion={region}
          style={{ flex: 1 }}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          {this.renderMarkers()}
        </MapView>
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

MapScreen.navigatorStyle = { navBarHidden: true, tabBarHidden: true };

const mapStateToProps = state => ({
  items: getFilteredItems(state),
  favoritesIds: getFavoriteItemsIds(state)
});

export default withTheme(connect(mapStateToProps)(MapScreen));

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
