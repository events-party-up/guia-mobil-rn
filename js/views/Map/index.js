import MapView from "./MapView";
import FiltersModal from "./FiltersModal";
import { StackNavigator } from "react-navigation";

export default StackNavigator(
  {
    MapView: {
      screen: MapView
    },
    FiltersModal: {
      screen: FiltersModal
    }
  },
  {
    mode: "modal",
    headerMode: "none",
    navigationOptions: {
      header: null
    }
  }
);
