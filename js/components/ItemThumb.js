// @flow
import React from "react";
import { Dimensions, View, Text, Image, TouchableOpacity } from "react-native";
import StyleSheet from "./common/F8StyleSheet";
import F8Colors from "./common/F8Colors";
import F8Fonts from "./common/F8Fonts";
import { Rating } from "react-native-elements";

type ThumbType = "small" | "large";
type Props = {
  category: number,
  onPress: () => void,
  image: string,
  title: string,
  stars: number,
  activeOpacity: number,
  isFavorite: boolean,
  type: ThumbType
};

const WINDOW_WIDTH = Dimensions.get("window").width;
const CONTAINER_PADDING_H = 15;
const GUTTER = 8;
const ROW_SPACING = 40;
const WIDTH_LARGE = WINDOW_WIDTH - CONTAINER_PADDING_H * 2;
const WIDTH_SMALL = (WINDOW_WIDTH - CONTAINER_PADDING_H * 2 - GUTTER) / 2;
const IMAGE_ASPECT_RATIO_SMALL = 99 / 169;
const IMAGE_ASPECT_RATIO_LARGE = 202 / 344;
const NUMLINES_SMALL = 3;
const NUMLINES_LARGE = 2;

const lakeImage =
  "https://upload.wikimedia.org/wikipedia/commons/2/22/Lago_Nahuel_Huapi%2C_Argentina%2C_2005.jpeg";

class ItemThumb extends React.Component<Props> {
  static defaultProps = {
    type: "small",
    activeOpacity: 0.75,
    isFavorite: false
  };

  getImageSize = (type: ThumbType) =>
    type === "large"
      ? {
          imageWidth: WIDTH_LARGE,
          imageHeight: WIDTH_LARGE * IMAGE_ASPECT_RATIO_LARGE
        }
      : {
          imageWidth: WIDTH_SMALL,
          imageHeight: WIDTH_SMALL * IMAGE_ASPECT_RATIO_SMALL
        };

  renderImage = (src: string, width: number, height: number) => (
    <Image
      style={[styles.image, { width, height }]}
      source={{
        uri: src
          ? `https://bariloche.guiasmoviles.com/uploads/${src}`
          : lakeImage
      }}
    />
  );

  renderTitle = (type: ThumbType, title: string) => {
    const titleLineLimit = type === "large" ? NUMLINES_LARGE : NUMLINES_SMALL;
    const titleDifferences =
      type === "large" ? styles.titleLarge : styles.titleSmall;
    if (title) {
      return (
        <Text
          numberOfLines={titleLineLimit}
          style={[styles.title, titleDifferences]}
        >
          {title}
        </Text>
      );
    }
    return null;
  };
  render() {
    const {
      category,
      onPress,
      image,
      title,
      activeOpacity,
      isFavorite,
      type,
      stars
    } = this.props;

    const { imageWidth, imageHeight } = this.getImageSize(type);

    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        style={type === "large" ? styles.containerLarge : styles.containerSmall}
        onPress={() => onPress && onPress()}
      >
        <View style={styles.thumb}>
          {this.renderImage(image, imageWidth, imageHeight)}
        </View>
        {this.renderTitle(type, title)}

        <Rating
          type="star"
          fractions={1}
          startingValue={stars || 0}
          readonly
          imageSize={14}
          ratingBackgroundColor="transparent"
          ratingColor="#0000ff"
          style={{ paddingVertical: 10, backgroundColor: "transparent" }}
        />
      </TouchableOpacity>
    );
  }
}

export default ItemThumb;

/* StyleSheet =============================================================== */
const styles = StyleSheet.create({
  containerLarge: {
    marginVertical: ROW_SPACING / 2,
    width: WIDTH_LARGE,
    paddingHorizontal: GUTTER / 2
  },
  containerSmall: {
    marginVertical: ROW_SPACING / 2,
    width: WIDTH_SMALL + GUTTER,
    paddingHorizontal: GUTTER / 2
  },

  image: {
    backgroundColor: F8Colors.tangaroa,
    resizeMode: "cover",
    borderRadius: 10
  },
  title: {
    color: F8Colors.black
  },
  titleSmall: {
    marginTop: 9,
    fontSize: 13,
    lineHeight: F8Fonts.lineHeight(17)
  },
  titleLarge: {
    marginTop: 12,
    fontSize: 17,
    lineHeight: F8Fonts.lineHeight(22)
  }
});
