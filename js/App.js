import React from "react";
import MapboxGL from "@mapbox/react-native-mapbox-gl";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity
} from "react-native";

import { Icon } from "react-native-elements";

// components
import MapHeader from "./components/common/MapHeader";

// styles
import sheet from "./styles/sheet";
import colors from "./styles/colors";

// utils
import { IS_ANDROID } from "./utils";
import config from "./utils/config";

// examples
import ShowMap from "./components/ShowMap";
import SetPitch from "./components/SetPitch";
import SetBearing from "./components/SetBearing";
import ShowClick from "./components/ShowClick";
import FlyTo from "./components/FlyTo";
import FitBounds from "./components/FitBounds";
import SetUserTrackingModes from "./components/SetUserTrackingModes";
import SetUserLocationVerticalAlignment from "./components/SetUserLocationVerticalAlignment";
import ShowRegionDidChange from "./components/ShowRegionDidChange";
import CustomIcon from "./components/CustomIcon";
import YoYo from "./components/YoYo";
import EarthQuakes from "./components/EarthQuakes";
import GeoJSONSource from "./components/GeoJSONSource";
import WatercolorRasterTiles from "./components/WatercolorRasterTiles";
import TwoByTwo from "./components/TwoByTwo";
import IndoorBuilding from "./components/IndoorBuilding";
import QueryAtPoint from "./components/QueryAtPoint";
import QueryWithRect from "./components/QueryWithRect";
import ShapeSourceIcon from "./components/ShapeSourceIcon";
import CustomVectorSource from "./components/CustomVectorSource";
import ShowPointAnnotation from "./components/ShowPointAnnotation";
import CreateOfflineRegion from "./components/CreateOfflineRegion";
import DriveTheLine from "./components/DriveTheLine";
import ImageOverlay from "./components/ImageOverlay";
import DataDrivenCircleColors from "./components/DataDrivenCircleColors";
import ChoroplethLayerByZoomLevel from "./components/ChoroplethLayerByZoomLevel";
import PointInMapView from "./components/PointInMapView";
import TakeSnapshot from "./components/TakeSnapshot";
import TakeSnapshotWithMap from "./components/TakeSnapshotWithMap";

const styles = StyleSheet.create({
  noPermissionsText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  header: {
    marginTop: 48,
    fontSize: 24,
    textAlign: "center"
  },
  exampleList: {
    flex: 1,
    marginTop: 60 + 12 // header + list padding,
  },
  exampleListItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc"
  },
  exampleListItem: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  exampleListLabel: {
    fontSize: 18
  },
  exampleBackground: {
    flex: 1,
    backgroundColor: colors.primary.pinkFaint
  }
});

MapboxGL.setAccessToken(config.get("MAPBOX_ACCESS_TOKEN"));

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetchingAndroidPermission: IS_ANDROID,
      isAndroidPermissionGranted: false
    };

    this.renderItem = this.renderItem.bind(this);
    this.onCloseExample = this.onCloseExample.bind(this);
  }

  async componentWillMount() {
    if (IS_ANDROID) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      this.setState({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false
      });
    }
  }

  onExamplePress(activeExamplePosition) {
    this.setState({ activeExample: activeExamplePosition });
  }

  onCloseExample() {
    this.setState({ activeExample: -1 });
  }

  renderItem({ item, index }) {
    return (
      <View style={styles.exampleListItemBorder}>
        <TouchableOpacity onPress={() => this.onExamplePress(index)}>
          <View style={styles.exampleListItem}>
            <Text style={styles.exampleListLabel}>{item.label}</Text>
            <Icon name="keyboard-arrow-right" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    if (IS_ANDROID && !this.state.isAndroidPermissionGranted) {
      if (this.state.isFetchingAndroidPermission) {
        return null;
      }
      return (
        <View style={sheet.matchParent}>
          <Text style={styles.noPermissionsText}>
            You need to accept location permissions in order to use this example
            applications
          </Text>
        </View>
      );
    }

    return (
      <View style={sheet.matchParent}>
        <MapHeader label="React Native Mapbox GL" />

        <View style={sheet.matchParent}>
          <View style={styles.exampleBackground}>
            <ShowMap label={"Map"} onDismissExample={this.onCloseExample} />
          </View>
        </View>
      </View>
    );
  }
}

export default App;
