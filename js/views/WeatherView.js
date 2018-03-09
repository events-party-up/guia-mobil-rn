// @flow
import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { withTheme } from "styled-components";
import Header from "../components/Header";
import { weatherUpdate } from "../actions";
import { connect } from "react-redux";

type Props = {
  dispatch: Function,
  theme: Object,
  lastUpdate: number
};

class WeatherView extends Component<Props> {
  componentDidMount() {
    this.props.dispatch(weatherUpdate());
  }
  render() {
    const { theme, navigation, lastUpdate, temperature, loaded } = this.props;
    return (
      <View style={styles.container}>
        <Header
          leftItem={{
            icon: "window-close",
            iconType: "material-community",
            onPress: () => navigation.goBack(null)
          }}
          title="Clima"
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
          itemsColor="white"
        />
        <ScrollView style={styles.container}>
          <Text> Temp: {loaded && temperature} </Text>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  let props = {
    lastUpdate: state.weather.lastUpdate,
    loaded: false
  };
  if (state.weather.status) {
    props = {
      ...props,
      ...state.weather.status.currently,
      loaded: true
    };
  }
  return props;
};

export default withTheme(connect(mapStateToProps)(WeatherView));

// styles
// ===================

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
