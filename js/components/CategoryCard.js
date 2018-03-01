// @flow
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Heading3 } from "./common/Text";
import { Card } from "react-native-elements";
import styled from "styled-components";
type Props = {
  name: string,
  image?: string,
  onPress?: () => void
};

const WINDOW_WIDTH = Dimensions.get("window").width;
const CONTAINER_PADDING_H = 15;
const GUTTER = 8;
const ROW_SPACING = 40;
const IMAGE_ASPECT_REATIO = 291 / 389;
const WIDTH = (WINDOW_WIDTH * 0.9 - CONTAINER_PADDING_H * 2 - GUTTER) / 2;
const HEIGHT = IMAGE_ASPECT_REATIO * WIDTH;

const CategoryTitle = styled(Heading3)`
  color: ${props => props.theme.colors.gray};
`;

const CategoryCard = (props: Props) => {
  const { name, onPress, image } = props;
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => onPress && onPress()}>
      <Card
        containerStyle={styles.card}
        imageStyle={styles.image}
        image={image}
      >
        <CategoryTitle>{name}</CategoryTitle>
      </Card>
    </TouchableOpacity>
  );
};
export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    width: WIDTH,
    marginVertical: 10,
    marginHorizontal: GUTTER / 2,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2
  },
  image: {
    height: HEIGHT
  }
});
