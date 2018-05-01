import { Navigation, NativeEventsReceiver } from "react-native-navigation";

import setup from "./js/setup";

Promise.resolve(Navigation.isAppLaunched()).then(appLaunched => {
  if (appLaunched) {
    setup();
  }
  new NativeEventsReceiver().appLaunched(() => {
    setup();
  });
});
