import { applyMiddleware, createStore } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import { AsyncStorage } from "react-native";
import thunk from "redux-thunk";
import reducers from "../reducers";

const createGuideStore = applyMiddleware(thunk)(createStore);

async function configureStore(onComplete: ?() => void) {
	const store = autoRehydrate()(createGuideStore)(reducers);
	persistStore(store, { storage: AsyncStorage }, _ => onComplete());

	return store;
}

module.exports = configureStore;
