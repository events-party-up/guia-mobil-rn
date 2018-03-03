import { StackNavigator } from "react-navigation";
import SettingsView from "./SettingsView";
import SettingsContentView from "./SettingsContentView";

const SettingsStack = StackNavigator(
  {
    Settings: {
      screen: SettingsView
    },
    Details: {
      screen: SettingsContentView
    }
  },
  {
    headerMode: "none"
  }
);

export default SettingsStack;
