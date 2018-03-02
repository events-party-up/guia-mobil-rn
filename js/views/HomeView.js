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
import styled from "styled-components";
import type NavigationScreenProp from "react-navigation";
import { withTheme } from "styled-components";
import { getImageUrl } from "../utils";
import { FacebookLoginButton } from "../components/FacebookLoginButton";
import Header from "../components/Header";
import { Heading2, Heading4 } from "../components/common/Text";
import { getFeaturedItems } from "../reducers";
import ItemThumb from "../components/ItemThumb";
import { IItem } from "../models";
import CategoryCard from "../components/CategoryCard";
import WeekPicsCarrousel from "../components/WeekPicsCarrousel";
import StyleSheet from "../components/common/F8StyleSheet";

type Props = {
    navigation: NavigationScreenProp,
    featuredItems: IItem[]
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

class HomeView extends React.Component<Props> {
    navigateToMap = () => {
        this.props.navigation.navigate("MapStack");
    };

    renderFeaturedList = (featuredItems: IItem[]) => {
        console.log({ featuredItems });
        return (
            <View style={styles.featuredList}>
                {featuredItems.map(item => (
                    <ItemThumb
                        key={item.id}
                        id={item.id}
                        categoryId={item.category_id}
                        image={item.image}
                        title={item.name}
                        isFavorite={false}
                        stars={item.rating}
                        onPress={() =>
                            this.props.navigation &&
                            this.props.navigation.navigate("ItemDetailsView", {
                                id: item.id
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
                name: "Alojamientos",
                tab: "SleepTab",
                image: require("./img/cover-hotel.png")
            },
            {
                name: "Gastronomia",
                tab: "EatTab",
                image: require("./img/cover-cake.png")
            },
            {
                name: "Experiencias",
                tab: "TodoTab",
                image: require("./img/cover-gondolas.png")
            },
            {
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
                        {...category}
                        onPress={() => {
                            this.props.navigation.navigate(category.tab);
                        }}
                    />
                ))}
            </ScrollView>
        );
    };

    render() {
        const {
            userName,
            isAuthenticated,
            profilePic,
            featuredItems,
            theme,
            weekPics
        } = this.props;

        const rightItem = {
            title: "Map",
            layout: "icon",
            icon: require("../components/img/header/map.png"),
            onPress: this.navigateToMap
        };

        const leftItem = {
            title: "Menu",
            layout: "icon",
            icon: require("../components/img/header/menu.png"),
            onPress: () =>
                this.props.navigation &&
                this.props.navigation.navigate("Settings")
        };

        const showWeekPics: boolean = weekPics.length > 0;

        return (
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <Header
                    backgroundColor="transparent"
                    rightItem={rightItem}
                    leftItem={leftItem}
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

                        <Heading2>Descubrí Bariloche.</Heading2>
                        {this.renderCategoriesPreviews()}
                        <Heading2 style={{ paddingTop: 20 }}>
                            Las mejores actividades para disfrutar.
                        </Heading2>
                        <Subtitle>
                            Conocé los lugares que recomendamos para visitar y
                            disfrutar.
                        </Subtitle>
                        {this.renderFeaturedList(featuredItems)}
                    </View>

                    {showWeekPics && (
                        <WeekImagesContainer>
                            <WeekImagesHeader>
                                Fotos de la semana
                            </WeekImagesHeader>
                            <WeekPicsCarrousel pictures={weekPics} />
                        </WeekImagesContainer>
                    )}
                </ScrollView>
            </View>
        );
    }
}
/*
{isAuthenticated && (
  <View>
    <Text>{userName} </Text>
    <Image
      style={{ width: 50, height: 50 }}
      source={{
        uri: profilePic
      }}
    />
  </View>
)}
<FacebookLoginButton />
*/

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
    featuredItems: getFeaturedItems(state),
    isAuthenticated: state.auth.isAuthenticated,
    weekPics: state.weekPics,
    userName:
        state.auth.isAuthenticated && state.auth.userProfile
            ? `${state.auth.userProfile.firstName} ${
                  state.auth.userProfile.lastName
              }`
            : "",
    profilePic:
        state.auth.isAuthenticated && state.auth.userProfile
            ? state.auth.userProfile.profilePic
            : ""
});
export default withTheme(connect(mapStateToProps)(HomeView));
