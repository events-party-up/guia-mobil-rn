// @flow
import React from "react";
import { TabNavigator } from "react-navigation";
import { Icon } from "react-native-elements";
import styled from "styled-components";
import CategoriesStack from "./CategoriesStack";

const EAT_CATEGORIES_ID = 30;
const SLEEP_CATEGORIES_ID = 1;
const TODO_CATEGORIES_ID = 36;
const SERVICES_CATEGORIES_ID = 46;

const ACTIVE_TINT_COLOR = "#0a71b3";

const TabIcon = styled(Icon).attrs({
  color: props =>
    props.focused ? props.theme.colors.primary : props.inactiveTintColor,
  size: 25
})``;

export default TabNavigator(
  {
    EatTab: {
      screen: CategoriesStack(EAT_CATEGORIES_ID),
      navigationOptions: { tabBarLabel: "Comer" }
    },
    SleepTab: {
      screen: CategoriesStack(SLEEP_CATEGORIES_ID),
      navigationOptions: { tabBarLabel: "Dormir" }
    },
    TodoTab: {
      screen: CategoriesStack(TODO_CATEGORIES_ID),
      navigationOptions: { tabBarLabel: "Actividades" }
    },
    ServicesTab: {
      screen: CategoriesStack(SERVICES_CATEGORIES_ID),
      navigationOptions: { tabBarLabel: "Servicios" }
    }
  },
  {
    backBehavior: "none",
    swipeEnabled: false,
    animationEnabled: false,
    tabBarPosition: "bottom",
    tabBarOptions: {
      upperCaseLabel: false,
      showIcon: true,
      indicatorStyle: { height: 0, margin: 0 },
      activeTintColor: ACTIVE_TINT_COLOR,
      labelStyle: {
        fontSize: 10,
        margin: 4
      },
      activeBackgroundColor: "white",
      inactiveBackgroundColor: "white",
    },
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === "EatTab") {
          return (
            <TabIcon
              focused={focused}
              name="food"
              type="material-community"
              inactiveTintColor={tintColor}
            />
          );
        } else if (routeName === "SleepTab") {
          return (
            <TabIcon
              focused={focused}
              name="hotel"
              type="material-community"
              inactiveTintColor={tintColor}
            />
          );
        } else if (routeName === "ServicesTab") {
          return (
            <TabIcon
              focused={focused}
              name="marker"
              type="material-community"
              inactiveTintColor={tintColor}
            />
          );
        } else if (routeName === "TodoTab") {
          return (
            <TabIcon
              focused={focused}
              name="mountains"
              type="foundation"
              inactiveTintColor={tintColor}
            />
          );
        }
        return null;
      }
    })
  }
);
