// @flow
import React from "react";
import { Provider } from "react-redux";
import { PushNotificationIOS } from "react-native";
import PushNotification from "react-native-push-notification";
import type Store from "redux";
import configureStore from "./store/configureStore";
import App from "./App";

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
      configureStore(
        // rehydration callback (after async compatibility and persistStore)
        () => this.setState({ storeRehydrated: true })
      ).then(
        // creation callback (after async compatibility)
        store => {
          this.setState({ store, storeCreated: true });
          this.setupPush(store);
        }
      );
    }

    onTokenReceived = (token: string) => {
      console.log("TOKEN:", token);
    };
    onNotification = notification => {
      console.log("NOTIFICATION:", notification);

      // process the notification

      // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    };
    setupPush = (store: Store) => {
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
          <App />
        </Provider>
      );
    }
  }

  return Root;
}

module.exports = setup;
