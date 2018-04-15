// @flow
import React from "react";
import { withTheme } from "styled-components";

type Props = {
  theme: Object,
  imageSource: Object
};

const IconButton = ({ imageSource, theme }: Props) => (
  <View
    style={{
      backgroundColor: theme.colors.primary,
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 10
    }}
  >
    <Image
      source={imageSource}
      style={{ width: 24, height: 24 }}
      resizeMode="contain"
    />
  </View>
);

export default withTheme(IconButton);
