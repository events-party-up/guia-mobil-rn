import React from "react";
import { View, Button, Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import { FacebookLoginButton } from "../components/FacebookLoginButton";
import Header from "../components/Header";
import { Heading2, Heading4 } from "../components/common/Text";
import { getFeaturedItems } from "../reducers";
import ItemThumb from "../components/ItemThumb";
import { IItem } from "../models";
import type NavigationScreenProp from "react-navigation";

type Props = {
    navigation: NavigationScreenProp,
    featuredItems: IItem[]
};
class HomeView extends React.Component {
    navigateToMap = () => {
        this.props.navigation.navigate("Map");
    };

    renderFeaturedList = (categoryId: number, featuredItems: IItem) => {
        console.log({ featuredItems });
        return (
            <View style={styles.featuredList}>
                {featuredItems
                    .filter(item => item.category_id !== 0)
                    .map(item => (
                        <ItemThumb
                            key={item.id}
                            id={item.id}
                            category={item.category_id}
                            image={item.image}
                            title={item.name}
                            isFavorite={false}
                            onPress={() =>
                                this.props.navigation &&
                                this.props.navigation.navigate(
                                    "ItemDetailsView",
                                    { id: item.id }
                                )
                            }
                        />
                    ))}
            </View>
        );
    };

    render() {
        const {
            userName,
            isAuthenticated,
            profilePic,
            featuredItems
        } = this.props;
        const rightItem = {
            title: "Map",
            layout: "icon",
            icon: require("../components/img/header/map.png"),
            onPress: () =>
                this.props.navigation && this.props.navigation.navigate("Map")
        };
        const leftItem = {
            title: "Menu",
            layout: "icon",
            icon: require("../components/img/header/menu.png"),
            onPress: () =>
                this.props.navigation &&
                this.props.navigation.navigate("Settings")
        };

        return (
            <View style={{ flex: 1 }}>
                <Header
                    backgroundColor="transparent"
                    rightItem={rightItem}
                    leftItem={leftItem}
                    itemsColor="blue"
                />
                <ScrollView>
                    <Heading2>Descubrí Bariloche.</Heading2>

                    <Heading2>Las mejores actividades para disfrutar.</Heading2>
                    <Heading4>
                        Conocé los lugares que recomendamos para visitar y
                        disfrutar.
                    </Heading4>

                    <Heading2>
                        Alojamientos destacados donde descansar.
                    </Heading2>
                    {this.renderFeaturedList(78, featuredItems)}
                    <Heading4>
                        Hospedate en los mejores alojamientos en base a tus
                        pretensiones.
                    </Heading4>
                    <Heading2>
                        Restaurantes recomendados, excelente gastronomia
                    </Heading2>
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

                    <Button
                        onPress={() => {
                            this.props.navigation.navigate("Tabs");
                        }}
                        title="Show Categories "
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    featuredList: {
        flexDirection: "row",
        flexWrap: "wrap"
    }
};
const mapStateToProps = state => ({
    featuredItems: getFeaturedItems(state),
    isAuthenticated: state.auth.isAuthenticated,
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
export default connect(mapStateToProps)(HomeView);
