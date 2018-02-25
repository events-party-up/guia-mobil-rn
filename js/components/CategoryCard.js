// @flow
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Heading3 } from "./common/Text";
import { Card } from "react-native-elements";

type Props = {
  name: string,
  image?: string,
  onPress?: () => void
};

const WINDOW_WIDTH = Dimensions.get("window").width;
const CONTAINER_PADDING_H = 15;
const GUTTER = 8;
const ROW_SPACING = 40;
const IMAGE_ASPECT_REATIO = 99 / 169;
const WIDTH = (WINDOW_WIDTH * 0.9 - CONTAINER_PADDING_H * 2 - GUTTER) / 2;

const CategoryCard = (props: Props) => {
  const { name, onPress } = props;
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress && onPress()}>
      <Card
        containerStyle={styles.card}
        imageStyle={styles.image}
        image={{
          uri:
            "https://upload.wikimedia.org/wikipedia/commons/2/22/Lago_Nahuel_Huapi%2C_Argentina%2C_2005.jpeg"
        }}
      >
        <Heading3>{name}</Heading3>
      </Card>
    </TouchableOpacity>
  );
};
export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    width: WIDTH,
    marginVertical: ROW_SPACING,
    marginHorizontal: GUTTER / 2,
    borderRadius: 4,
    overflow: "hidden"
  },
  image: {}
});
