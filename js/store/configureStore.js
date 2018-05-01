// @flow
import { applyMiddleware, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { AsyncStorage } from "react-native";
import axios from "axios";
import thunk from "redux-thunk";
import apiCallMiddleware from "./apiCallMiddleware";
import rootReducer from "../reducers";
import Reactotron from "reactotron-react-native";

const apiClient = axios.create({
  baseURL: "https://bariloche.guiasmoviles.com/",
  timeout: 5000
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage
  // blacklist: ["items"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

async function configureStore(onComplete: () => void) {
  const store = Reactotron.createStore(
    persistedReducer,
    applyMiddleware(thunk, apiCallMiddleware(apiClient))
  );

  persistStore(store, null, onComplete);
  // const store = createGuideStore(reducers);
  // persistStore(store, { storage: AsyncStorage }, onComplete);
  // onComplete();
  return store;
}

export default configureStore;
