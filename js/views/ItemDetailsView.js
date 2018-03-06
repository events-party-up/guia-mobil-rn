// @flow
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
  TouchableOpacity,
  Linking,
  WebView,
  Platform
} from "react-native";
import { connect } from "react-redux";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import { Icon } from "react-native-elements";
import styled, { withTheme } from "styled-components";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import type NavigationScreenProp from "react-navigation";
import * as actions from "../actions";
import { IItem, ICategory, IReview, IChar } from "../models";
import Header from "../components/Header";
import Button from "../components/Button";
import {
  getCategoryChain,
  getItemWithId,
  getReviewsForItemId,
  getCharsWithIds,
  getGalleryForItem
} from "../reducers";
import Rating from "../components/Rating";
import Reviews from "../components/Reviews";
import ItemMapMarker from "../components/ItemMapMarker";
import { toLatLong, getAppleMapsUri, getGoogleMapsUri } from "../utils/maps";
import { DEFAULT_CENTER_COORDINATE } from "../utils";

const WINDOW_WIDTH = Dimensions.get("window").width;
const IMAGE_HEIGHT = 200;

const lakeImage = require("../components/img/lake.jpeg");

const CategoryLabel = styled.Text`
  color: ${props => props.theme.colors.primary};
  padding-horizontal: 10px;
`;

const CategoryBreakdrum = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-vertical: 10px;
  align-items: center;
`;

const arrowLeft = require("../components/img/header/back.png");

const ThemedImage = styled.Image`
  tint-color: ${props => props.theme.colors.primary};
  height: 10px;
  width: 10px;
`;

const Separator = () => <ThemedImage source={arrowLeft} />;

interface Props extends IItem {
  isFavourite: boolean;
  dispatch: Function;
  image: ?string;
  phone: ?string;
  reviews: IReview[];
  itemChars: IChar[];
  categoryChain: Array<ICategory>;
  navigation: NavigationScreenProp;
  theme: Object;
}

class ItemDetailsView extends Component<Props> {
  static navigationOptions = ({ name }) => ({
    title: name,
    header: null
  });

  componentDidMount() {
    const { id } = this.props;
    this.props.dispatch(actions.galleryLoad(id));
  }
  toggleFavourite = id => {
    this.props.dispatch(actions.toggleFavourite(id));
  };

  callPlace = () => {
    const { phone } = this.props;
    if (phone) {
      Linking.openURL(`tel:${phone}`).catch(err =>
        console.error("An error occurred", err)
      );
    }
  };

  newReviewHandler = () => {};
  showRouteHandler = () => {
    const { coord, userLocation } = this.props;
    let uri: string;
    if(Platform.OS === "ios") {
      uri = getAppleMapsUri(toLatLong(coord), toLatLong(userLocation));
    } else {
      uri = getGoogleMapsUri(toLatLong(coord), toLatLong(userLocation));
    }
    Linking.openURL(uri).catch(err =>
      console.error("An error occurred opening maps", err)
    );
  };

  renderHeader = () => {
    const { isFavourite, navigation, id } = this.props;
    const rightItem = {
      title: "Settings",
      layout: "icon",
      iconType: "material-community",
      icon: isFavourite ? "heart" : "heart-outline",
      onPress: () => this.toggleFavourite(id)
    };

    return (
      <View style={styles.headerContainer}>
        <Header
          backgroundColor="transparent"
          navItem={{ back: true, onPress: () => navigation.goBack(null) }}
          rightItem={rightItem}
          itemsColor="white"
        />
      </View>
    );
  };

  renderCategoriesBreakdrum = () => {
    const { categoryChain } = this.props;
    return (
      <CategoryBreakdrum>
        {categoryChain
          .map(category => (
            <CategoryLabel key={`cat_${category.id}`}>
              {category.name.toUpperCase()}
            </CategoryLabel>
          ))
          .reduce((items, category) => {
            if (items.length)
              return [
                ...items,
                <Separator key={`sep_${items.length}`} />,
                category
              ];
            return [...items, category];
          }, [])}
      </CategoryBreakdrum>
    );
  };

  renderInfoItem = (iconName, text) => {
    const { theme } = this.props;
    if (text) {
      return (
        <View style={styles.contactRow}>
          <Icon
            type="material-community"
            style={styles.contactRowIcon}
            name={iconName}
            color={theme.colors.primary}
          />
          <Text> {text} </Text>
        </View>
      );
    }
    return null;
  };

  renderItemChars = () => {
    const { itemChars, theme } = this.props;
    if (itemChars.length) {
      const icons = itemChars.map(char => char.icon).join(" ");
      console.log({ icons });
      return (
        <WebView
          scrollEnable={false}
          bounces={false}
          javaScriptEnabled={false}
          scalesPageToFit={false}
          style={{
            width: WINDOW_WIDTH - 20,
            height: 80
          }}
          source={{
            html: `
                <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body>
                <style>
                svg {
                  width: 30px;
                  height: 30px;
                  fill: blue;
                  display: inline-block;
                  margin: 10px;
                  fill: ${theme.colors.primary};
                }
                svg path {
                  fill: ${theme.colors.primary};
                }
                svg circle {
                  fill: ${theme.colors.primary};
                }
                body {
                  height: 60px;
                  display: flex;
                  align-items: center;
                  overflow: auto;
                }
              </style>
               
                  ${icons}
               </body>
               <html>`
          }}
        />
      );
    }
    return null;
  };

  render() {
    const {
      name,
      description,
      image,
      phone,
      mail,
      address,
      theme,
      coord,
      price,
      rating,
      url,
      id,
      reviews
    } = this.props;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white"
        }}
      >
        <ParallaxScrollView
          backgroundColor={theme.colors.primary}
          contentBackgroundColor="white"
          stickyHeaderHeight={70}
          backgroundSpeed={10}
          renderFixedHeader={() => this.renderHeader()}
          renderStickyHeader={() => (
            <View
              style={{
                height: 70,
                backgroundColor: theme.colors.primary
              }}
            />
          )}
          parallaxHeaderHeight={IMAGE_HEIGHT}
          renderBackground={() => (
            <Animated.Image
              key="parallax-header"
              source={
                image && image.length
                  ? {
                      uri: `https://bariloche.guiasmoviles.com/uploads/${image}`
                    }
                  : lakeImage
              }
              style={{
                width: WINDOW_WIDTH,
                height: IMAGE_HEIGHT
              }}
            />
          )}
        >
          {this.renderCategoriesBreakdrum()}
          <Text style={styles.title}> {name.toUpperCase()}</Text>
          <View style={styles.actionItems}>
            <Button title="LLamar" primary onPress={this.callPlace} />
            <Button title="Ver en mapa" primary />
          </View>
          <View style={styles.contactItems}>
            {this.renderInfoItem("phone", phone)}
            {this.renderInfoItem("email", mail)}
            {this.renderInfoItem("map-marker", address)}
            {!!price && (
              <View style={styles.contactRow}>
                <Icon
                  type="material-icons"
                  style={styles.contactRowIcon}
                  name="attach-money"
                  color={theme.colors.primary}
                />
                <Rating imageSize={12} rating={price} type="circle" />
              </View>
            )}

            {!!rating && (
              <View style={styles.contactRow}>
                <Icon
                  type="material-community"
                  style={styles.contactRowIcon}
                  name="star"
                  color={theme.colors.primary}
                />
                <Rating imageSize={12} rating={rating} />
              </View>
            )}
            {this.renderItemChars()}

            {this.renderInfoItem("link", url)}
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}> {description} </Text>
          </View>
          <View style={styles.mapWrapper}>
            <MapboxGL.MapView
              ref={c => {
                this.map = c;
              }}
              style={styles.map}
              textureMode
              styleURL={MapboxGL.StyleURL.Street}
              centerCoordinate={coord}
              zoomLevel={14}
              height={200}
              zoomEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
            >
              <MapboxGL.PointAnnotation
                id={`${id}`}
                coordinate={coord}
                anchor={{ x: 0.5, y: 1.0 }}
              >
                <ItemMapMarker />
              </MapboxGL.PointAnnotation>
            </MapboxGL.MapView>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionWrapper}>
              <Icon
                raised
                reverse
                name="insert-comment"
                type="material-icons"
                color={theme.colors.primary}
                onPress={this.newReviewHandler}
              />
              <Text>Calificar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionWrapper}
              onPress={this.showRouteHandler}
            >
              <Icon
                raised
                reverse
                name="navigation"
                type="material-icons"
                color={theme.colors.primary}
              />
              <Text>Llevarme ahí</Text>
            </TouchableOpacity>
          </View>
          <Reviews reviews={reviews} />
        </ParallaxScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state, { navigation }) => {
  const id = navigation.getParam("id");
  const item = getItemWithId(state, id);

  return {
    ...item,
    reviews: getReviewsForItemId(state, id),
    categoryChain: getCategoryChain(state, item.category_id),
    itemChars: getCharsWithIds(state, item.chars),
    itemGallery: getGalleryForItem(state, item.id),
    userLocation: DEFAULT_CENTER_COORDINATE
  };
};

export default withTheme(connect(mapStateToProps)(ItemDetailsView));

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },
  title: {
    padding: 10,
    fontSize: 20
  },
  descriptionContainer: {
    borderTopWidth: 2,
    borderTopColor: "lightgray",
    margin: 10,
    paddingVertical: 20
  },
  description: {
    color: "#939393"
  },
  topBar: {
    height: 40,
    padding: 10
  },
  contactItems: {
    margin: 10
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4
  },
  contactRowIcon: {
    width: 42,
    height: 30,
    borderWidth: 1,
    marginRight: 60
  },
  actionItems: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10
  },
  actionWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  mapWrapper: {
    height: 200,
    width: WINDOW_WIDTH,
    overflow: "hidden"
  },
  map: {
    width: WINDOW_WIDTH,
    height: 200
  }
});
