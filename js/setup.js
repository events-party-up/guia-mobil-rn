import React from "react";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import App from "./App";

function setup() {
  console.disableYellowBox = true;

  class Root extends React.Component {
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
        _ => this.setState({ storeRehydrated: true })
      ).then(
        // creation callback (after async compatibility)
        store => this.setState({ store, storeCreated: true })
      );
    }

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
