import Reactotron, {
  trackGlobalErrors,
  openInEditor,
  overlay,
  asyncStorage,
  networking
} from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";

const configuredReactotron = Reactotron.configure({
  host: "192.168.0.142",
  name: "React Native Demo"
})
  .use(trackGlobalErrors())
  .use(openInEditor())
  .use(overlay())
  .use(reactotronRedux())
  .use(asyncStorage())
  .use(networking());

export default configuredReactotron;
