// @flow
import React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { withTheme } from "styled-components";
import type NavigationScreenProp from "react-navigation";
import Hyperlink from "react-native-hyperlink";
import Header from "../../components/Header";

type Props = {
  theme: Object,
  navigation: NavigationScreenProp
};

const SettingsContentView = ({ theme, navigation }: Props) => (
  <View style={styles.container}>
    <Header
      title={navigation.getParam("title", "")}
      navItem={{
        back: true,
        onPress: () => navigation.goBack(null)
      }}
      backgroundColor={theme.colors.primary}
      titleColor={theme.colors.highContrast}
    />
    <ScrollView style={styles.container}>
      <Hyperlink linkDefault linkStyle={{ color: "#2980b9" }}>
        <Text style={styles.text}>
          lorem ipsum https://trello.com/b/I2G57Ued/guia-animus
        </Text>
      </Hyperlink>
    </ScrollView>
  </View>
);

export default withTheme(SettingsContentView);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 20,
    padding: 16
  }
});
