import React from "react";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import { Button, Icon } from "react-native-elements";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StackNavigator } from "react-navigation";
import { connect } from "react-redux";
import sheet from "./styles/sheet";
import colors from "./styles/colors";
import { FacebookLoginButton } from "./components/FacebookLoginButton";
import { IS_ANDROID } from "./utils";
import config from "./utils/config";
import MapView from "./views/MapView";
import CategoriesList from "./views/CategoriesList";
import ItemsListView from "./views/ItemsListView";
import ItemDetailsView from "./views/ItemDetailsView";
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
    const { userName, isAuthenticated, profilePic } = this.props;
    console.log({ profilePic });
    return (
      <View style={sheet.matchParent}>
        {isAuthenticated && (
          <View>
            <Text>{userName} </Text>
            <Image
              style={{ width: 50, height: 50 }}
              source={{
                uri: profilePic
              }}
            />
          </View>
        )}
        <FacebookLoginButton />
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
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
    isAuthenticated: auth.isAuthenticated,
    userName:
      auth.isAuthenticated && auth.userProfile
        ? `${auth.userProfile.firstName} ${auth.userProfile.lastName}`
        : "",
    profilePic:
      auth.isAuthenticated && auth.userProfile
        ? auth.userProfile.profilePic
        : ""
  });

const ConnectedApp = connect(mapStateToProps)(App);

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
