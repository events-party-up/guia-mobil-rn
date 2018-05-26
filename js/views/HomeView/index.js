// @flow
import React from "react";
import MapboxGL from "@mapbox/react-native-mapbox-gl";
import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import OneSignal from "react-native-onesignal";
import { connect } from "react-redux";
import { withTheme } from "styled-components";
import flatten from "lodash/flatten";
import debounce from "lodash/debounce";
import { IS_ANDROID } from "../../utils";
import Header from "../../components/Header";
import { Heading2 } from "../../components/common/Text";
import { getFeaturedItemIds, getFavoriteItemsIds } from "../../reducers";
import ItemThumb from "../../components/ItemThumb";
import { IItem } from "../../models";
import CategoryCard from "../../components/CategoryCard";
import WeekPicsCarrousel from "../../components/WeekPicsCarrousel";
import StyleSheet from "../../components/common/F8StyleSheet";
import getRealm, { itemsToArray } from "../../database";
import I18n from "../../i18n";
import * as actions from "../../actions";
import type { Dispatch } from "../../actions/types";
import { WeekImagesContainer, Subtitle, WeekImagesHeader } from "./elements";
import { geolocationSettings } from "../../config";

const EAT_CATEGORIES_ID = 30;
const SLEEP_CATEGORIES_ID = 1;
const TODO_CATEGORIES_ID = 36;
const SERVICES_CATEGORIES_ID = 46;

type Props = {
  navigator: Object,
  featuredIds: number[],
  favoritesIds: number[],
  theme: Object,
  dispatch: Dispatch,
  weekPics: any[]
};

type State = {
  featuredItems: IItem[],
  loading: boolean
};

const WINDOW_WIDTH = Dimensions.get("window").width;
const CONTAINER_PADDING_H = 15;
const WIDTH = WINDOW_WIDTH - 2 * CONTAINER_PADDING_H;

class HomeView extends React.Component<Props, State> {
  static navigatorStyle = {
    drawUnderNavBar: false,
    navBarTranslucent: true
  };

  constructor(props: Props) {
    super(props);
    this.loadFeaturedItems(this.props.featuredIds);
  }

  state: State = {
    featuredItems: [],
    loading: true
  };

  async componentWillMount() {
    if (IS_ANDROID) {
      OneSignal.setLogLevel(7, 0);
      OneSignal.inFocusDisplaying(2);
      OneSignal.getPermissionSubscriptionState(
        (status: {
          pushToken: string,
          userId: string,
          notificationsEnabled: boolean,
          subscriptionEnabled: boolean,
          userSubscriptionEnabled: boolean
        }) => {
          const { userId, pushToken } = status;
          this.props.dispatch(actions.registerDeviceToken(pushToken, userId));
        }
      );
      OneSignal.addEventListener(
        "received",
        this.onReceivedOneSignalPushNotification
      );
      OneSignal.addEventListener(
        "opened",
        this.onOpenedOneSignalPushNotification
      );
    }
  }

  componentDidMount() {
    this.props.dispatch(actions.categoriesUpdate());
    this.props.dispatch(actions.itemsUpdate());
    this.props.dispatch(actions.itemsLoadFeatured());
    this.props.dispatch(actions.weekPicsUpdate());
    this.props.dispatch(actions.reviewsUpdate());
    this.props.dispatch(actions.charsUpdate());
    this.fetchUserLocation();
  }

  componentWillReceiveProps(nextProps: Props) {
    this.loadFeaturedItems(nextProps.featuredIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener(
      "received",
      this.onReceivedOneSignalPushNotification
    );
    OneSignal.removeEventListener(
      "opened",
      this.onOpenedOneSignalPushNotification
    );
  }

  onReceivedOneSignalPushNotification = notification => {
    console.log("Notification received: ", notification);
    this.props.dispatch(actions.receivePush(notification));
  };

  onOpenedOneSignalPushNotification = openResult => {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
  };

  fetchUserLocation = async () => {
    const isGranted = await MapboxGL.requestAndroidLocationPermissions();
    if (isGranted) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { coords } = pos;
          console.log({ coords });
          this.props.dispatch(actions.userLocationUpdate(coords));
        },
        err => {
          console.error("Failed getting user coords");
          console.error({ err });
        },
        geolocationSettings
      );
    }
  };

  loadFeaturedItems = featuredItemIds => {
    getRealm().then(realm => {
      const items = realm.objects("Item");
      const featuredItems = flatten(
        featuredItemIds.map(id => itemsToArray(items.filtered(`id = ${id}`)))
      );

      this.setState({
        featuredItems,
        loading: false
      });
    });
  };

  navigateToMap = () => {
    this.props.navigator.push({ screen: "animus.MapView" });
  };

  navigateToFavorites = () => {
    this.props.navigator.push({ screen: "animus.FavoritesView" });
  };

  navigateToCategory = id => {
    this.props.navigator.push({
      screen: "animus.CategoriesList",
      passProps: { id }
    });
  };

  navigateToNotifications = () => {
    this.props.navigator.showModal({
      screen: "animus.NotificationsView"
    });
  };

  renderFeaturedList = () => {
    const { featuredItems, loading } = this.state;

    if (loading) {
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
            isFavorite={this.props.favoritesIds.indexOf(item.id) >= 0}
            stars={item.rating}
            coord={item.coord}
            onPress={debounce(
              () =>
                this.props.navigator.push({
                  screen: "animus.ItemDetailsView",
                  passProps: {
                    item
                  }
                }),
              2000
            )}
          />
        ))}
      </View>
    );
  };

  renderCategoriesPreviews = () => {
    const categories = [
      {
        id: EAT_CATEGORIES_ID,
        name: "Gastronomia",
        tab: "EatTab",
        tabIdx: 1,
        image: require("../img/cover-cake.png")
      },
      {
        id: SLEEP_CATEGORIES_ID,
        name: "Alojamientos",
        tab: "SleepTab",
        tabIdx: 2,
        image: require("../img/cover-hotel.png")
      },
      {
        id: TODO_CATEGORIES_ID,
        name: "Actividades",
        tab: "TodoTab",
        tabIdx: 3,
        image: require("../img/cover-gondolas.png")
      },
      {
        id: SERVICES_CATEGORIES_ID,
        name: "Servicios",
        tab: "ServicesTab",
        tabIdx: 4,
        image: require("../img/cover-services.jpg")
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
            onPress={debounce(
              () =>
                this.props.navigator.switchToTab({ tabIndex: category.tabIdx }),
              1000
            )}
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
      iconType: "simple-line-icon",
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
              icon: "search",
              iconType: "material",
              onPress: () =>
                navigator.showModal({ screen: "animus.SearchView" })
            },
            {
              icon: "sun",
              iconType: "feather",
              onPress: () =>
                navigator.showModal({ screen: "animus.WeatherView" })
            },
            {
              icon: "notifications-none",
              iconType: "material-icons",
              onPress: this.navigateToNotifications
            },
            {
              icon: "favorite-border",
              iconType: "material-icons",
              onPress: this.navigateToFavorites
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
              source={require("../img/logo.png")}
            />

            <Heading2>{I18n.t("discoverPlace")}</Heading2>
            {this.renderCategoriesPreviews()}
            <Heading2 style={{ paddingTop: 20 }}>
              {I18n.t("activitiesHeadline")}
            </Heading2>
            <Subtitle>{I18n.t("activitiesHeadlineSub")}</Subtitle>
            {this.renderFeaturedList()}
          </View>

          {showWeekPics &&
            weekPics.length > 0 && (
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
  state,
  isAuthenticated: state.auth.isAuthenticated,
  weekPics: state.weekPics,
  favoritesIds: getFavoriteItemsIds(state),
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
