// @flow
import React from "react";
import { Provider } from "react-redux";
import { PushNotificationIOS } from "react-native";
import { ThemeProvider } from "styled-components";
// $FlowIssue
import PushNotification from "react-native-push-notification";
import type Store from "redux";
import Reactotron from "./ReactotronConfig";
import configureStore from "./store/configureStore";
import App from "./App";
import theme from "./theme";
import getRealm from "./database";

type State = {
  storeCreated: boolean,
  store: ?Store,
  storeRehydrated: boolean
};

function setup() {
  class Root extends React.Component<{}, State> {
    constructor() {
      super();
      this.state = {
        storeCreated: false,
        storeRehydrated: false,
        store: null
      };
    }
    componentDidMount() {
      this.setupPush();
      configureStore(
        // rehydration callback (after async compatibility and persistStore)
        () => {
          console.log("Store rehydrated");
          this.setState({ storeRehydrated: true });
        }
      ).then(
        // creation callback (after async compatibility)
        store => {
          // Reactotron.connect();
          this.setState({ store, storeCreated: true });
        }
      );

      // initialize realm
      getRealm().then(realm => {
        console.log(
          `Realm initialized. Schema Version: ${realm.schemaVersion}`
        );
      });
    }

    onTokenReceived = ({ token, os }: { token: string, os: string }) => {
      console.log("TOKEN PUSH:", token);
    };

    onNotification = notification => {
      console.log("NOTIFICATION:", notification);

      // process the notification

      // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    };
    setupPush = (store: Store) => {
      console.log("Setting push notifications");
      PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: this.onTokenReceived,

        // (required) Called when a remote or local notification is opened or received
        onNotification: this.onNotification,

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

    render() {
      if (!this.state.storeCreated || !this.state.storeRehydrated) {
        return null;
      }
      return (
        <Provider store={this.state.store}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Provider>
      );
    }
  }

  return Root;
}

module.exports = setup;
