import React from "react";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import { Button } from "react-native-elements";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity
} from "react-native";
import { StackNavigator } from "react-navigation";

import { Icon } from "react-native-elements";

// components
import MapHeader from "./components/common/MapHeader";

// styles
import sheet from "./styles/sheet";
import colors from "./styles/colors";

// utils
import { IS_ANDROID } from "./utils";
import config from "./utils/config";

import ShowMap from "./components/ShowMap";
import CategoriesList from "./components/CategoriesList";
import ItemsListView from "./components/ItemsListView";
import MapView from "./components/ShowMap";
import ItemDetailsView from "./components/views/ItemDetailsView";
import * as actions from "./actions";

import { connect } from "react-redux";

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

  componentDidMount() {
    this.props.dispatch(actions.categoriesUpdate());
    this.props.dispatch(actions.itemsUpdate());
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
  navigateToMap = () => {
    this.props.navigation.navigate("MapView");
  };
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
        <Button
          title="Show Map"
          onPress={this.navigateToMap}
          buttonStyle={{
            backgroundColor: "rgba(92, 99,216, 1)",
            width: 300,
            height: 45,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
          textStyle={{ color: "white" }}
        />
        <CategoriesList navigation={this.props.navigation} />
        {/*<View style={sheet.matchParent}>
          <View style={styles.exampleBackground}>
            <ShowMap label={"Map"} onDismissExample={this.onCloseExample} />
          </View>
        </View>*/}
      </View>
    );
  }
}
const ConnectedApp = connect()(App);

export default StackNavigator({
  Home: {
    screen: ConnectedApp
  },
  CategoriesList: {
    screen: CategoriesList
  },
  ItemsListView: {
    screen: ItemsListView
  },
  MapView: {
    screen: MapView
  },
  ItemDetailsView: {
    screen: ItemDetailsView
  }
});
