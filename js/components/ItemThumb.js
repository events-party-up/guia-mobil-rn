// @flow
import React from "react";
import { Dimensions, View, Text, Image, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import StyleSheet from "./common/F8StyleSheet";
import F8Colors from "./common/F8Colors";
import F8Fonts from "./common/F8Fonts";
import Rating from "./Rating";
import styled from "styled-components";
import { connect } from "react-redux";
import { ICategory } from "../models";
import { getCategoryWithId } from "../reducers";
import * as actions from "../actions";
import { computeDistanceBetweenPoints } from "../utils/maps";
import { DEFAULT_CENTER_COORDINATE } from "../utils";

type ThumbType = "small" | "large";

type Props = {
  id: number,
  coord: number[],
  category: ICategory,
  onPress: () => void,
  image: string,
  title: string,
  stars: number,
  activeOpacity: number,
  isFavorite: boolean,
  type: ThumbType,
  userLocation?: {
    latitude: number,
    longitude: number
  },
  dispatch: Function
};

const CategoryLabel = styled.Text`
  padding-top: 4px;
  padding-bottom: 4px;
  color: ${props => props.theme.colors.primary};
`;

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

const lakeImage = require("./img/lake.jpeg");

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

  toggleFavourite = id => {
    this.props.dispatch(actions.toggleFavourite(id));
  };

  renderTitle = (type: ThumbType, title: string) => {
    const titleLineLimit = type === "large" ? NUMLINES_LARGE : NUMLINES_SMALL;
    const titleDifferences =
      type === "large" ? styles.titleLarge : styles.titleSmall;
    if (title) {
      return (
        <Text numberOfLines={2} style={[styles.title, titleDifferences]}>
          {title}
        </Text>
      );
    }
    return null;
  };

  renderImage = (src: string, width: number, height: number) => (
    <Image
      style={[styles.image, { width, height }]}
      source={
        src
          ? {
              uri: `https://bariloche.guiasmoviles.com/uploads/${src}`
            }
          : {
              uri: "lake"
            }
      }
    />
  );

  render() {
    const {
      category,
      onPress,
      image,
      title,
      activeOpacity,
      isFavorite,
      type,
      id,
      stars,
      coord,
      userLocation
    } = this.props;
    let distance = "...";
    if (userLocation && coord) {
      distance = computeDistanceBetweenPoints(coord, DEFAULT_CENTER_COORDINATE);
    }
    const { imageWidth, imageHeight } = this.getImageSize(type);

    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        style={type === "large" ? styles.containerLarge : styles.containerSmall}
        onPress={() => onPress && onPress()}
      >
        <View style={styles.thumb}>
          {this.renderImage(image, imageWidth, imageHeight)}
          <TouchableOpacity
            style={styles.favouriteToggle}
            onPress={() => this.toggleFavourite(id)}
          >
            <Icon
              name={isFavorite ? "heart" : "heart-outline"}
              type="material-community"
              color="white"
              size={24}
            />
          </TouchableOpacity>
        </View>
        <CategoryLabel>{category.name.toUpperCase()} </CategoryLabel>
        {this.renderTitle(type, title)}
        <Text>
          Dist:{" "}
          {typeof distance === "number" ? `${distance.toFixed(2)}km` : distance}
        </Text>
        <Rating imageSize={14} rating={stars} />
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state, { categoryId }) => ({
  category: getCategoryWithId(state, categoryId),
  userLocation: state.location.coords
});

export default connect(mapStateToProps)(ItemThumb);

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
  thumb: {
    overflow: "hidden",
    borderRadius: 10
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
    marginTop: 4,
    fontSize: 13,
    lineHeight: F8Fonts.lineHeight(17)
  },
  titleLarge: {
    marginTop: 12,
    fontSize: 17,
    lineHeight: F8Fonts.lineHeight(22)
  },
  favouriteToggle: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 10
  }
});
