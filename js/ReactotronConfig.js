import Reactotron, {
  trackGlobalErrors,
  openInEditor,
  overlay,
  asyncStorage,
  networking
} from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";

const configuredReactotron = Reactotron.configure({
  host: "143.169.149.202",
  name: "React Native Demo"
})
  .use(trackGlobalErrors())
  .use(openInEditor())
  .use(overlay())
  .use(reactotronRedux())
  .use(asyncStorage())
  .use(networking());

export default configuredReactotron;
