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
      Reactotron.connect();
      const AppProvider = ({ children, ...props }) => (
        <Provider {...props}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </Provider>
      );

      registerScreens(store, AppProvider);
      Navigation.startSingleScreenApp({
        screen: {
          title: "Screen One",
          screen: "animus.Home", // unique ID registered with Navigation.registerScreen,
          navigatorStyle: {
            navBarHidden: true
          },
          navigatorButtons: {} // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        }
      });
    }
  );

  const onTokenReceived = ({ token, os }: { token: string, os: string }) => {
    console.log("TOKEN PUSH:", token);
  };

  const onNotification = notification => {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  };
  const setupPush = (store: Store) => {
    console.log("Setting push notifications");
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: onTokenReceived,

      // (required) Called when a remote or local notification is opened or received
      onNotification,

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: "YOUR GCM SENDER ID",

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
