// @flow
import React from "react";
import {
  View,
  Button,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import styled, { withTheme } from "styled-components";
import flatten from "lodash/flatten";
import Reactotron from "reactotron-react-native";
import { getImageUrl } from "../utils";
import { FacebookLoginButton } from "../components/FacebookLoginButton";
import Header from "../components/Header";
import { Heading2 } from "../components/common/Text";
import { getFeaturedItemIds } from "../reducers";
import ItemThumb from "../components/ItemThumb";
import { IItem } from "../models";
import CategoryCard from "../components/CategoryCard";
import WeekPicsCarrousel from "../components/WeekPicsCarrousel";
import StyleSheet from "../components/common/F8StyleSheet";
import getRealm, { itemsToArray } from "../database";
import I18n from "../i18n";

const EAT_CATEGORIES_ID = 30;
const SLEEP_CATEGORIES_ID = 1;
const TODO_CATEGORIES_ID = 36;
const SERVICES_CATEGORIES_ID = 46;

type Props = {
  navigator: Object,
  featuredIds: number[]
};

type State = {
  featuredItems: IItem[],
  loading: boolean
};

const Subtitle = styled.Text`
  color: ${props => props.theme.colors.gray};
  font-size: 18px;
  line-height: 18px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const WINDOW_WIDTH = Dimensions.get("window").width;
const CONTAINER_PADDING_H = 15;
const WIDTH = WINDOW_WIDTH - 2 * CONTAINER_PADDING_H;

const WeekImagesContainer = styled.View`
  background-color: ${props => props.theme.colors.lightBackground};
  padding-horizontal: ${CONTAINER_PADDING_H}px;
  padding-top: 20px;
  padding-bottom: 40px;
`;

const WeekImagesHeader = styled(Heading2)`
  color: ${props => props.theme.colors.gray};
  padding-vertical: 10px;
`;

class HomeView extends React.Component<Props, State> {
  static navigatorStyle = {
    drawUnderNavBar: false,
    navBarTranslucent: true
  };

  static navigatorButtons = {
    rightButtons: [
      {
        title: "Edit", // for a textual button, provide the button title (label)
        id: "edit", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        testID: "e2e_rules", // optional, used to locate this view in end-to-end tests
        disabled: true, // optional, used to disable the button (appears faded and doesn't interact)
        disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
        showAsAction: "ifRoom", // optional, Android only. Control how the button is displayed in the Toolbar. Accepted valued: 'ifRoom' (default) - Show this item as a button in an Action Bar if the system decides there is room for it. 'always' - Always show this item as a button in an Action Bar. 'withText' - When this item is in the action bar, always show it with a text label even if it also has an icon specified. 'never' - Never show this item as a button in an Action Bar.
        buttonColor: "blue", // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
        buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
        buttonFontWeight: "600" // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
      }
    ]
  };

  constructor(props: Props) {
    super(props);
    this.loadFeaturedItems(this.props.featuredIds);
  }
  state: State = {
    featuredItems: [],
    loading: true
  };

  componentWillReceiveProps(nextProps: Props) {
    this.loadFeaturedItems(nextProps.featuredIds);
  }

  loadFeaturedItems = featuredItemIds => {
    getRealm().then(realm => {
      const items = realm.objects("Item");
      Reactotron.log("HomeView: got realm");
      const featuredItems = flatten(
        featuredItemIds.map(id => itemsToArray(items.filtered(`id = ${id}`)))
      );
      Reactotron.log("HomeView: got items", { featuredItems });
      Reactotron.log(featuredItemIds);

      this.setState({
        featuredItems,
        loading: false
      });
    });
  };

  navigateToMap = () => {
    this.props.navigator.push({ screen: "animus.MapView" });
  };

  navigateToCategory = id => {
    this.props.navigator.push({
      screen: "animus.CategoriesList",
      passProps: { id }
    });
  };

  renderFeaturedList = () => {
    const { featuredItems, isLoading } = this.state;
    if (isLoading) {
      return <Text>Cargando...</Text>;
    }
    return (
      <View style={styles.featuredList}>
        {featuredItems.map(item => (
          <ItemThumb
            key={item.id}
            id={item.id}
            categoryId={item.category_id}
            image={item.image}
            title={item.name}
            isFavorite={item.isFavourite}
            stars={item.rating}
            coord={item.coord}
            onPress={() =>
              this.props.navigator.push({
                screen: "animus.ItemDetailsView",
                passProps: {
                  item
                }
              })
            }
          />
        ))}
      </View>
    );
  };

  renderCategoriesPreviews = () => {
    const categories = [
      {
        id: SLEEP_CATEGORIES_ID,
        name: "Alojamientos",
        tab: "SleepTab",
        image: require("./img/cover-hotel.png")
      },
      {
        id: EAT_CATEGORIES_ID,
        name: "Gastronomia",
        tab: "EatTab",
        image: require("./img/cover-cake.png")
      },
      {
        id: TODO_CATEGORIES_ID,
        name: "Experiencias",
        tab: "TodoTab",
        image: require("./img/cover-gondolas.png")
      },
      {
        id: SERVICES_CATEGORIES_ID,
        name: "Servicios",
        tab: "ServicesTab",
        image: require("./img/cover-gondolas.png")
      }
    ];
    return (
      <ScrollView
        contentContainerStyle={styles.categoriesScroll}
        horizontal
        snapToInterval={158}
        decelerationRate="fast"
        snapToAlignment="start"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {categories.map(category => (
          <CategoryCard
            key={category.tab}
            onPress={() => this.navigateToCategory(category.id)}
            {...category}
          />
        ))}
      </ScrollView>
    );
  };

  render() {
    const { theme, weekPics, navigator } = this.props;

    const rightItem = {
      title: "Map",
      layout: "icon",
      icon: "map",
      type: "map",
      onPress: this.navigateToMap
    };

    const leftItem = {
      title: "Menu",
      layout: "icon",
      icon: "settings",
      iconType: "material-icons",
      onPress: () =>
        this.props.navigator.showModal({ screen: "animus.SettingsView" })
    };

    const showWeekPics: boolean = weekPics.length > 0;

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Header
          backgroundColor="transparent"
          rightItem={rightItem}
          leftItem={leftItem}
          extraItems={[
            {
              icon: "sun",
              iconType: "feather",
              onPress: () =>
                navigator.showModal({ screen: "animus.WeatherView" })
            },
            {
              icon: "notifications-none",
              iconType: "material-icons",
              onPress: this.navigateToMap
            },
            {
              icon: "favorite-border",
              iconType: "material-icons",
              onPress: this.navigateToMap
            }
          ]}
          itemsColor={theme.colors.primary}
        />
        <ScrollView>
          <View style={styles.withPadding}>
            <Image
              style={{
                height: 90,
                width: 200,
                resizeMode: "contain",
                alignSelf: "center"
              }}
              source={require("./img/logo.png")}
            />

            <Heading2>{I18n.t("discoverPlace")}</Heading2>
            {this.renderCategoriesPreviews()}
            <Heading2 style={{ paddingTop: 20 }}>
              {I18n.t("activitiesHeadline")}
            </Heading2>
            <Subtitle>{I18n.t("activitiesHeadlineSub")}</Subtitle>
            {this.renderFeaturedList()}
          </View>

          {showWeekPics && (
            <WeekImagesContainer>
              <WeekImagesHeader>Fotos de la semana</WeekImagesHeader>
              <WeekPicsCarrousel pictures={weekPics} />
            </WeekImagesContainer>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  featuredList: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  withPadding: {
    paddingLeft: 10,
    paddingRight: 10
  },
  categoriesScroll: {
    paddingVertical: 10
  },
  weekImage: {
    borderRadius: 8,
    width: WIDTH,
    height: WIDTH * 0.675,
    resizeMode: "cover"
  }
});

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  weekPics: state.weekPics,
  featuredIds: getFeaturedItemIds(state),
  userName:
    state.auth.isAuthenticated && state.auth.userProfile
      ? `${state.auth.userProfile.firstName} ${state.auth.userProfile.lastName}`
      : "",
  profilePic:
    state.auth.isAuthenticated && state.auth.userProfile
      ? state.auth.userProfile.profilePic
      : ""
});
export default withTheme(connect(mapStateToProps)(HomeView));
