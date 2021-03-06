// @flow
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform,
  Share
} from "react-native";
import { connect } from "react-redux";
import PhotoView from "@merryjs/photo-viewer";
import { withTheme } from "styled-components";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import * as actions from "../actions";
import { IItem, ICategory, IReview, IChar } from "../models";
import Header from "../components/Header";
import Button from "../components/Button";
import {
  getCategoryChain,
  getReviewsForItemId,
  getCharsWithIds,
  getGalleryForItem,
  isItemFavourite
} from "../reducers";
import Reviews from "../components/Reviews";
import MapPreview from "../components/MapPreview";
import CategoriesBreakdrum from "../components/CategoriesBrackdrum";
import ItemInfoBlock from "../components/ItemInfoBlock";
import ImageGalleryPreview from "../components/ImageGalleryPreview";
import IconButton from "../components/common/IconButton";
import ReviewItemButton from "../components/ReviewItemButton";
import type { Gallery } from "../reducers/galleries";
import { openRouteToItem } from "../utils/maps";
import {
  DEFAULT_CENTER_COORDINATE,
  getImageUrl,
  toggleFavorite
} from "../utils";

const WINDOW_WIDTH = Dimensions.get("window").width;
const IMAGE_HEIGHT = 200;
const STICKY_HEADER_HEIGHT = Platform.OS === "ios" ? 70 : 56;
const lakeImage = require("../components/img/lake.jpeg");

interface Props extends IItem {
  isFavorite: boolean;
  dispatch: Function;
  image: ?string;
  phone: ?string;
  reviews: IReview[];
  itemChars: IChar[];
  categoryChain: Array<ICategory>;
  navigator: Object;
  theme: Object;
  itemGallery: Gallery;
  userLocation: number[];
}
type State = {
  galleryVisible: boolean,
  activeImageIndex: number
};

class ItemDetailsView extends Component<Props, State> {
  static navigatorStyle = { navBarHidden: true, tabBarHidden: true };

  state: State = {
    galleryVisible: false,
    activeImageIndex: 0
  };

  componentDidMount() {
    const { id } = this.props;

    this.props.dispatch(actions.galleryLoad(id));
  }

  callPlace = () => {
    const { phone } = this.props;
    if (phone) {
      Linking.openURL(`tel:${phone}`).catch(err =>
        console.error("An error occurred", err)
      );
    }
  };

  shareItemHandler = () => {
    const { name } = this.props;
    Share.share(
      {
        message: `Me gustó ${name}! Encuentra esta información y más en la Guía de Bariloche, descargala ya mismo desde Play Store! https://play.google.com/store/apps/details?id=com.animus.guideapp`,
        title: name
      },
      {
        subject: "",
        tintColor: this.props.theme.colors.primary,
        dialogTitle: "Share"
      }
    );
  };

  // onScroll = evt => {
  //   if (evt.nativeEvent.contentOffset.y <= -20) {
  //     this.setState({ galleryVisible: true });
  //   }
  // };

  toggleFavourite = id => {
    toggleFavorite(this.props.dispatch, id, this.props.isFavorite);
  };

  showRouteHandler = () => {
    openRouteToItem(this.props.coord, this.props.userLocation);
  };

  renderHeader = () => {
    const { isFavorite, navigator, id } = this.props;
    const rightItem = {
      title: "Settings",
      layout: "icon",
      iconType: "material-community",
      icon: isFavorite ? "heart" : "heart-outline",
      onPress: () => this.toggleFavourite(id)
    };

    return (
      <View style={styles.headerContainer}>
        <Header
          backgroundColor="transparent"
          navItem={{ back: true, onPress: () => navigator.pop() }}
          rightItem={rightItem}
          itemsColor="white"
          extraItems={[
            {
              icon: "share-2",
              iconType: "feather",
              onPress: this.shareItemHandler
            }
          ]}
        />
      </View>
    );
  };

  render() {
    const { name, image, theme, coord, id, reviews } = this.props;
    const photos = [
      {
        id: 0,
        source: image ? { uri: getImageUrl(image) } : lakeImage
      },
      ...this.props.itemGallery.map(galleryPic => ({
        id: galleryPic.id,
        source: {
          uri: getImageUrl(galleryPic.image)
        }
      }))
    ];
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
          stickyHeaderHeight={STICKY_HEADER_HEIGHT}
          backgroundSpeed={10}
          renderFixedHeader={() => this.renderHeader()}
          renderStickyHeader={() => (
            <View
              style={{
                height: STICKY_HEADER_HEIGHT,
                backgroundColor: theme.colors.primary
              }}
            />
          )}
          renderForeground={() => (
            <ImageGalleryPreview
              key="parallax-header"
              onPress={() => this.setState({ galleryVisible: true })}
              onChangeActiveImage={idx =>
                this.setState({ activeImageIndex: idx })
              }
              height={IMAGE_HEIGHT}
              gallery={photos}
            />
          )}
          parallaxHeaderHeight={IMAGE_HEIGHT}
        >
          <CategoriesBreakdrum categoryChain={this.props.categoryChain} />
          <Text style={styles.title}> {name.toUpperCase()}</Text>
          <View style={styles.actionItems}>
            <Button title="LLAMAR" primary onPress={this.callPlace} />
            <Button title="VER EN MAPA" primary />
          </View>
          <ItemInfoBlock {...this.props} />
          <View style={styles.descriptionContainer} />
          <View style={styles.mapWrapper}>
            <MapPreview marker={coord} />
          </View>
          <View style={styles.actionsContainer}>
            <ReviewItemButton navigator={this.props.navigator} itemId={id} />
            <TouchableOpacity
              style={styles.actionWrapper}
              onPress={this.showRouteHandler}
            >
              <IconButton
                imageSource={require("../components/img/navigate_icon.png")}
              />
              <Text>Llevarme ahí</Text>
            </TouchableOpacity>
          </View>
          <Reviews reviews={reviews} />
          {photos.length > 0 && (
            <PhotoView
              visible={this.state.galleryVisible}
              data={photos}
              hideStatusBar
              initial={this.state.activeImageIndex}
              onDismiss={() => {
                // don't forgot set state back.
                this.setState({ galleryVisible: false });
              }}
            />
          )}
        </ParallaxScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state, { item }) => {
  let userCoord = DEFAULT_CENTER_COORDINATE;
  if (state.location.coord) {
    const { latitude, longitude } = state.location.coord;
    userCoord = [latitude, longitude];
  }
  if (item) {
    return {
      ...item,
      isFavorite: isItemFavourite(state, item.id),
      reviews: getReviewsForItemId(state, item.id),
      categoryChain: getCategoryChain(state, item.category_id),
      itemChars: getCharsWithIds(state, item.chars),
      itemGallery: getGalleryForItem(state, item.id),
      userLocation: userCoord
    };
  }
  return {};
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
  actionItems: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20
  },
  actionWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  mapWrapper: {
    height: 200,
    width: WINDOW_WIDTH,
    overflow: "hidden"
  }
});
