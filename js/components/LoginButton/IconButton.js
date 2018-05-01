// @flow
import React, { Component } from "react";
import { TouchableOpacity, Image, View } from "react-native";

type Props = {
  onPress: () => void,
  iconImageSource: Object
};

const IconButton = (props: Props) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={props.onPress}>
        <Image source={props.iconImageSource} />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  buttonContainer: {
    width: 60,
    height: 60,
    backgroundColor: "white",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  }
};

export default IconButton;
