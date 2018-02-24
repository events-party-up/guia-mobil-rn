// @flow
import React from "react";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import { Icon } from "react-native-elements";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import sheet from "./styles/sheet";
import colors from "./styles/colors";
import { StackNavigator } from "react-navigation";
import { IS_ANDROID } from "./utils";
import config from "./utils/config";

import HomeView from "./views/HomeView";
import MapView from "./views/MapView";
import TabsNavigator from "./views/TabsNavigator";
import * as actions from "./actions";

MapboxGL.setAccessToken(config.get("MAPBOX_ACCESS_TOKEN"));

type Props = {
  dispatch: Function
};

const NavigationStack = StackNavigator(
  {
    Home: {
      screen: HomeView
    },
    Tabs: {
      screen: TabsNavigator
    },
    Map: {
      screen: MapView
    }
  },
  {
    navigationOptions: {
      header: null
    }
  }
);

class App extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isFetchingAndroidPermission: IS_ANDROID,
      isAndroidPermissionGranted: false
    };

    this.renderItem = this.renderItem.bind(this);
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

  componentDidMount() {
    this.props.dispatch(actions.categoriesUpdate());
    this.props.dispatch(actions.itemsUpdate());
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
      return null;
    }

    return <NavigationStack />;
  }
}

export default connect()(App);
