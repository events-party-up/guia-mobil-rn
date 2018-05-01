// @flow
import React from "react";
import { View, Image, StyleSheet, TouchableNativeFeedback } from "react-native";
import { withTheme } from "styled-components";

type Props = {
  theme: Object,
  imageSource: Object,
  onPress: () => void
};

const IconButton = ({ imageSource, theme, onPress = () => {} }: Props) => (
  <TouchableNativeFeedback onPress={onPress}>
    <View
      style={[
        {
          backgroundColor: "#0b99e2"
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
  </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10
  }
});

export default withTheme(IconButton);
