// @flow
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { withTheme } from "styled-components";

type Props = {
  theme: Object,
  imageSource: Object
};

const IconButton = ({ imageSource, theme }: Props) => (
  <View
    style={[
      {
        backgroundColor: theme.colors.primary
      },
      styles.button
    ]}
  >
    <Image
      source={imageSource}
      style={{ width: 24, height: 24 }}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10
  }
});

export default withTheme(IconButton);
