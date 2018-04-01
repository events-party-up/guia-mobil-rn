// @flow
import React from "react";
import { Provider } from "react-redux";
import { PushNotificationIOS } from "react-native";
import { ThemeProvider } from "styled-components";
import { Navigation } from "react-native-navigation";
// $FlowIssue
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import PushNotification from "react-native-push-notification";
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

  Promise.all([
    configureStore(() => {
      // rehydration callback (after async compatibility and persistStore)
      // eslint-disable-next-line
      console.log("Store rehydrated");
    }),
    getRealm()
  ]).then(
    // eslint-disable-next-line
    ([store, realm]) => {
      setupPush(store);
      setupLocale(store);
      getUserLocation(store);
      Reactotron.connect();
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
            passProps: { id: 30 },
            navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
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
          tabBarSelectedButtonColor: "#0a71b3",
          tabBarButtonColor: "#0a71b3",
          forceTitlesDisplay: true,
          tabFontSize: 10,
          selectTabFontSize: 10
        }
      });
    }
  );

  const getUserLocation = store => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { coords } = pos;
        store.dispatch(actions.userLocationUpdate(coords));
      },
      () => {},
      geolocationSettings
    );
  };
  const setupLocale = store => {
    // configure the app locale from the redux store
    I18n.locale = store.getState().lang.code;
  };

  const onNotification = notification => {
    console.log("NOTIFICATION:", notification); // eslint-disable-line

    // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  };

  const setupPush = (store: Store) => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: ({ token }) => {
        store.dispatch(actions.registerDeviceToken(token));
      },
      onNotification,
      senderID: config.GCM_SENDER_ID,
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true
    });
  };
}

module.exports = setup;
