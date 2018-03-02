// @flow
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  Animated
} from "react-native";
import { connect } from "react-redux";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import { Icon } from "react-native-elements";
import styled, { withTheme } from "styled-components";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import type NavigationScreenProp from "react-navigation";
import * as actions from "../actions";
import ReviewsListView from "./ReviewsListView";
import { IItem, ICategory } from "../models";
import Header from "../components/Header";
import Button from "../components/Button";
import { getCategoryChain, getItemWithId } from "../reducers";

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
const favouriteIcon = require("./img/favorite.png");
const favouriteIconOutline = require("./img/favorite-outline.png");

interface Props extends IItem {
  isFavourite: boolean;
  dispatch: Function;
  image: ?string;
  phone: ?string;
  categoryChain: Array<ICategory>;
  navigation: NavigationScreenProp;
  theme: Object;
}

class ItemDetailsView extends Component<Props> {
  static navigationOptions = ({ name }) => ({
    title: name,
    header: null
  });

  toggleFavourite = id => {
    this.props.dispatch(actions.toggleFavourite(id));
  };

  renderInfoItem = (iconName, text) => {
    if (text) {
      return (
        <View style={styles.contactRow}>
          <Icon
            type="material-community"
            style={styles.contactRowIcon}
            name={iconName}
          />
          <Text> {text} </Text>
        </View>
      );
    }
    return null;
  };

  renderCategoriesBreakdrum = () => {
    const { categoryChain } = this.props;
    console.log({ categoryChain });
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
            else {
              return [...items, category];
            }
          }, [])}
      </CategoryBreakdrum>
    );
  };

  renderHeader = () => {
    const { isFavourite, navigation, id } = this.props;
    const rightItem = {
      title: "Settings",
      layout: "icon",
      icon: isFavourite ? favouriteIcon : favouriteIconOutline,
      onPress: () => this.toggleFavourite(id)
    };

    return (
      <View style={styles.headerContainer}>
        <Header
          backgroundColor="transparent"
          navItem={{ back: true, onPress: () => navigation.goBack(null) }}
          rightItem={rightItem}
        />
      </View>
    );
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
      navigation: { goBack }
    } = this.props;
    console.log({ coord });
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
            <Button title="LLamar" primary />
            <Button title="Ver en mapa" primary />
          </View>
          <View style={styles.contactItems}>
            {this.renderInfoItem("phone", phone)}
            {this.renderInfoItem("email", mail)}
            {this.renderInfoItem("map-marker", address)}
          </View>
          <Text style={styles.description}> {description} </Text>
          <View style={styles.mapWrapper}>
            <MapboxGL.MapView
              style={styles.map}
              textureMode
              styleURL={MapboxGL.StyleURL.Street}
              centerCoordinate={coord}
              zoomLevel={16}
              height={200}
              zoomEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
            />
          </View>
          <View>
            <Text>Evaluaciones</Text>
          </View>
          {/*<ReviewsListView itemId={id} />*/}
        </ParallaxScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state, { navigation }) => {
  const id = navigation.getParam("id");

  const item = getItemWithId(state, id);
  console.log({ item });
  return {
    ...item,
    comments: state.comments[id],
    categoryChain: getCategoryChain(state, item.category_id)
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
  description: {
    color: "#939393",
    padding: 10
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
    paddingVertical: 10
  },
  contactRowIcon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    marginRight: 30
  },
  actionItems: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10
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
