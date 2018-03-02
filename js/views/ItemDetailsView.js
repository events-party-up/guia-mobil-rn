// @flow
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  ScrollView,
  Animated
} from "react-native";
import { connect } from "react-redux";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import { Icon } from "react-native-elements";
import styled, { withTheme } from "styled-components";
import * as actions from "../actions";
import ReviewsListView from "./ReviewsListView";
import { IItem } from "../models";
import Header from "../components/Header";
import Button from "../components/Button";
import { getCategoryChain } from "../reducers";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").width;
const IMAGE_HEIGHT = 200;

interface Props extends IItem {
  isFavourite: boolean;
  dispatch: Function;
  image: ?string;
  phone: ?string;
  categoryChain: Array<ICategory>;
}

const ViewContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.highContrast};
`;

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

const lakeImage =
  "https://upload.wikimedia.org/wikipedia/commons/2/22/Lago_Nahuel_Huapi%2C_Argentina%2C_2005.jpeg";

const arrowLeft = require("../components/img/header/back.png");

const ThemedImage = styled.Image`
  tint-color: ${props => props.theme.colors.primary};
  height: 10px;
  width: 10px;
`;
const Separator = () => <ThemedImage source={arrowLeft} />;
const favouriteIcon = require("./img/favorite.png");
const favouriteIconOutline = require("./img/favorite-outline.png");

const scroll = new Animated.Value(0);
const onScroll = Animated.event([
  { nativeEvent: { contentOffset: { y: scroll } } }
]);

class ItemDetailsView extends Component<Props> {
  static navigationOptions = ({ name }) => ({
    title: name,
    header: null
  });

  toggleFavourite = id => {
    this.props.dispatch(actions.toggleFavourite(id));
  };

  constructor() {
    super();
  }

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

  render() {
    const {
      name,
      description,
      isFavourite,
      id,
      image,
      phone,
      mail,
      address,
      theme
    } = this.props;

    const rightItem = {
      title: "Settings",
      layout: "icon",
      icon: isFavourite ? favouriteIcon : favouriteIconOutline,
      onPress: () => this.toggleFavourite(id)
    };
    const { goBack } = this.props.navigation;
    const height = scroll.interpolate({
      inputRange: [0, IMAGE_HEIGHT - 50],
      outputRange: [IMAGE_HEIGHT, 50],
      extrapolate: "clamp"
    });
    return (
      <ViewContainer>
        <Animated.ScrollView
          alwaysBounceVertical={true}
          overScrollMode="auto"
          scrollEventThrottle={16}
          contentInsetAdjustmentBehavior="always"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: IMAGE_HEIGHT
          }}
          onScroll={onScroll}
          style={styles.scrollView}
          bounces={false}
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
          {isFavourite ? (
            <Text> You like this</Text>
          ) : (
            <Text>You dont like this</Text>
          )}
          <MapboxGL.MapView
            styleURL={MapboxGL.StyleURL.Street}
            centerCoordinate={this.props.coord}
            zoomLevel={16}
            height={200}
            zoomEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
          />
          <View>
            <Text>Evaluaciones</Text>
          </View>
          <ReviewsListView itemId={id} />
        </Animated.ScrollView>
        <Animated.Image
          source={{
            uri: image
              ? `https://bariloche.guiasmoviles.com/uploads/${image}`
              : lakeImage
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height
          }}
        />
        <View style={styles.headerContainer}>
          <Header
            backgroundColor="transparent"
            navItem={{ back: true, onPress: () => goBack(null) }}
            rightItem={rightItem}
          />
        </View>
      </ViewContainer>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },
  scollView: {
    position: "absolute",
    top: 0
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
    alignItems: "center"
  },
  contactRowIcon: {
    width: 40,
    height: 40,
    borderWidth: 1,
    marginRight: 30
  },
  actionItems: {
    flexDirection: "row",
    justifyContent: "space-around"
  }
});

const mapStateToProps = (state, { navigation }) => {
  const { id } = navigation.state.params;
  const item = state.items.byId[id];
  return {
    ...item,
    comments: state.comments[id],
    categoryChain: getCategoryChain(state, item.category_id)
  };
};

export default withTheme(connect(mapStateToProps)(ItemDetailsView));
