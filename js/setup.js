// @flow
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { Navigation } from "react-native-navigation";
// $FlowIssue
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import type Store from "redux";
import Reactotron from "./ReactotronConfig";
import configureStore from "./store/configureStore";
import { registerScreens } from "./views";
import theme from "./theme";
import getRealm from "./database";
import config from "./utils/config";
import I18n from "./i18n";
import { geolocationSettings } from "./config";
import * as actions from "./actions";

function setup() {
  MapboxGL.setAccessToken(config.get("MAPBOX_ACCESS_TOKEN"));
  console.log("Running setup");
  Promise.all([
    configureStore(() => {
      // rehydration callback (after async compatibility and persistStore)
      // eslint-disable-next-line
      console.log("Store rehydrated");
    }),
    getRealm()
  ])
    .then(
      // eslint-disable-next-line
      ([store, realm]) => {
        setupLocale(store);
        // Reactotron.connect();
        const AppProvider = ({ children, ...props }) => (
          <Provider {...props}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </Provider>
        );

        registerScreens(store, AppProvider);
        Navigation.startTabBasedApp({
          tabs: [
            {
              label: "Home",
              title: "Home",
              icon: require("./views/img/tab-home-icon.png"),
              screen: "animus.Home", // unique ID registered with Navigation.registerScreen,
              navigatorStyle: {
                navBarHidden: true
              },
              navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
            },
            {
              label: "Comer",
              title: "Comer",
              icon: require("./views/img/tab-eat-icon.png"),
              screen: "animus.CategoriesList", // unique ID registered with Navigation.registerScreen,
              navigatorStyle: {
                navBarHidden: true
              },
              passProps: { id: 30 }
            },
            {
              label: "Dormir",
              title: "Dormir",
              icon: require("./views/img/tab-sleep-icon.png"),
              screen: "animus.CategoriesList", // unique ID registered with Navigation.registerScreen,
              navigatorStyle: {
                navBarHidden: true
              },
              passProps: { id: 1 },
              navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
            },
            {
              label: "Actividades",
              title: "Actividades",
              icon: require("./views/img/tab-activities-icon.png"),
              screen: "animus.CategoriesList", // unique ID registered with Navigation.registerScreen,
              navigatorStyle: {
                navBarHidden: true
              },
              passProps: { id: 36 },
              navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
            },
            {
              label: "Servicios",
              title: "Servicios",
              icon: require("./views/img/tab-services-icon.png"),
              screen: "animus.CategoriesList", // unique ID registered with Navigation.registerScreen,
              navigatorStyle: {
                navBarHidden: true
              },
              passProps: { id: 46 },
              navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
            }
          ],
          appStyle: {
            orientation: "portrait", // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
            tabBarSelectedButtonColor: "#0a71b3",
            tabBarButtonColor: "#0a71b3",
            forceTitlesDisplay: true,
            tabFontSize: 10,
            selectTabFontSize: 10
          }
        });
      }
    )
    .catch(onReject => {
      console.error({ onReject });
    });
}

function setupLocale(store: Store) {
  // configure the app locale from the redux store
  I18n.locale = store.getState().lang.code;
}

module.exports = setup;
