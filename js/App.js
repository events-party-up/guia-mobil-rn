// @flow
import React from "react";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import { connect } from "react-redux";
import { StackNavigator } from "react-navigation";
import { IS_ANDROID } from "./utils";
import config from "./utils/config";
import HomeView from "./views/HomeView";
import MapStack from "./views/Map";
import TabsNavigator from "./views/TabsNavigator";
import * as actions from "./actions";

MapboxGL.setAccessToken(config.get("MAPBOX_ACCESS_TOKEN"));

type Props = {
  dispatch: Function
};

type State = {
  isFetchingAndroidPermission: boolean,
  isAndroidPermissionGranted: boolean
};
const NavigationStack = StackNavigator(
  {
    Home: {
      screen: HomeView
    },
    Tabs: {
      screen: TabsNavigator
    },
    MapStack: {
      screen: MapStack
    }
  },
  {
    navigationOptions: {
      header: null
    }
  }
);

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isFetchingAndroidPermission: IS_ANDROID,
      isAndroidPermissionGranted: false
    };
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
    this.props.dispatch(actions.itemsLoadFeatured());
    this.props.dispatch(actions.weekPicsUpdate());
  }

  render() {
    if (IS_ANDROID && !this.state.isAndroidPermissionGranted) {
      return null;
    }

    return <NavigationStack />;
  }
}

export default connect()(App);
