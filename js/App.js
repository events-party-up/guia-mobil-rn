// @flow
import React from "react";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import { Icon } from "react-native-elements";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import sheet from "./styles/sheet";
import colors from "./styles/colors";

import { IS_ANDROID } from "./utils";
import config from "./utils/config";

import HomeView from "./views/HomeView";
import * as actions from "./actions";

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

type Props = {
  dispatch: Function
};

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

    return <HomeView />;
  }
}

export default connect()(App);
