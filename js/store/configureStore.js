// @flow
import { applyMiddleware, createStore } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import { AsyncStorage } from "react-native";
import axios from "axios";
import thunk from "redux-thunk";
import logger from "redux-logger";
import apiCallMiddleware from "./apiCallMiddleware";
import reducers from "../reducers";

const apiClient = axios.create({
  baseURL: "https://bariloche.guiasmoviles.com/",
  timeout: 5000
});
const createGuideStore = applyMiddleware(
  apiCallMiddleware(apiClient),
  thunk,
  logger
)(createStore);

async function configureStore(onComplete: () => void) {
  const store = autoRehydrate()(createGuideStore)(reducers);
  // const store = createGuideStore(reducers);
  // persistStore(store, { storage: AsyncStorage }, onComplete);
  onComplete();
  return store;
}

export default configureStore;
