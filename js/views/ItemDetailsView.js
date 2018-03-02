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
import ParallaxScrollView from "react-native-parallax-scroll-view";
import * as actions from "../actions";
import ReviewsListView from "./ReviewsListView";
import { IItem } from "../models";
import Header, { AnimatableHeaderBackground } from "../components/Header";
import Button from "../components/Button";
import { getCategoryChain } from "../reducers";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").width;
const IMAGE_HEIGHT = 200;



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


type State = {
  isSticky: boolean;
}

interface Props extends IItem {
  isFavourite: boolean;
  dispatch: Function;
  image: ?string;
  phone: ?string;
  categoryChain: Array<ICategory>;
}


class ItemDetailsView extends Component<Props, State> {

  static navigationOptions = ({ name }) => ({
    title: name,
    header: null
  });

  toggleFavourite = id => {
    this.props.dispatch(actions.toggleFavourite(id));
  };

  state = {
    isSticky: false
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

  renderHeader = () => {
    const  {isFavourite  } = this.props
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
            navItem={{ back: true, onPress: () => goBack(null) }}
            rightItem={rightItem}/>
        </View>
        )
    }
    
  render() {
    const {
      name,
      description,
      id,
      image,
      phone,
      mail,
      address,
      theme,
      navigation: {goBack}
    } = this.props;

    
    const { isSticky } = this.state
  

    return (
      <ParallaxScrollView
        backgroundColor={theme.colors.primary}
        contentBackgroundColor={theme.colors.highContrast}
        stickyHeaderHeight={70}
        backgroundSpeed={10}
        onChangeHeaderVisibility={(isSticky) => this.setState({isSticky})}
        renderFixedHeader={()=> {
          return this.renderHeader()
        }}
        renderStickyHeader={() => (
          <View style={
            {
              height: 70,
              backgroundColor: theme.colors.primary
            }
          }/>)
        }
        parallaxHeaderHeight={200}
        renderForeground={() => (
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
              height: 200
            }}
          />
        )}
      >
        <ViewContainer>
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
        </ViewContainer>
      </ParallaxScrollView>
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
    flex: 1
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
