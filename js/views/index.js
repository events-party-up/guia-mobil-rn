import { Navigation, ScreenVisibilityListener } from "react-native-navigation";

import HomeView from "./HomeView";
import CategoriesList from "./CategoriesList";
import WeatherView from "./WeatherView";
import ItemDetailsView from "./ItemDetailsView";
import ItemsListView from "./ItemsListView";
import SettingsView from "./settings/SettingsView";
import LanguageSelectorView from "./settings/LanguageSelectorView";
import SettingsContentView from "./settings/SettingsContentView";

import MapView from "./Map/MapView";

export function registerScreens(store, Provider) {
  Navigation.registerComponent("animus.Home", () => HomeView, store, Provider);

  Navigation.registerComponent(
    "animus.CategoriesList",
    () => CategoriesList,
    store,
    Provider
  );
  Navigation.registerComponent(
    "animus.ItemsListView",
    () => ItemsListView,
    store,
    Provider
  );
  Navigation.registerComponent(
    "animus.ItemDetailsView",
    () => ItemDetailsView,
    store,
    Provider
  );
  Navigation.registerComponent(
    "animus.WeatherView",
    () => WeatherView,
    store,
    Provider
  );
  Navigation.registerComponent(
    "animus.SettingsView",
    () => SettingsView,
    store,
    Provider
  );
  Navigation.registerComponent(
    "animus.SettingsContentView",
    () => SettingsContentView,
    store,
    Provider
  );

  Navigation.registerComponent(
    "animus.LanguageSelectorView",
    () => LanguageSelectorView,
    store,
    Provider
  );

  Navigation.registerComponent(
    "animus.MapView",
    () => MapView,
    store,
    Provider
  );
}

/* eslint-disable no-console */
export function registerScreenVisibilityListener() {
  new ScreenVisibilityListener({
    willAppear: ({ screen }) => console.log(`Displaying screen ${screen}`),
    didAppear: ({ screen, startTime, endTime, commandType }) =>
      console.log(
        "screenVisibility",
        `Screen ${screen} displayed in ${endTime -
          startTime} millis [${commandType}]`
      ),
    willDisappear: ({ screen }) =>
      console.log(`Screen will disappear ${screen}`),
    didDisappear: ({ screen }) => console.log(`Screen disappeared ${screen}`)
  }).register();
}
/* eslint-enable */
