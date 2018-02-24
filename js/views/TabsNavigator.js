import React from "react";
import { TabNavigator } from "react-navigation";
import CategoriesStack from "./CategoriesStack";
import { Icon } from "react-native-elements";
const EAT_CATEGORIES_ID = 30;
const SLEEP_CATEGORIES_ID = 1;
const TODO_CATEGORIES_ID = 36;
const SERVICES_CATEGORIES_ID = 46;

export default TabNavigator(
  {
    EatTab: { screen: CategoriesStack(EAT_CATEGORIES_ID) },
    SleepTab: { screen: CategoriesStack(SLEEP_CATEGORIES_ID) },
    TodoTab: { screen: CategoriesStack(TODO_CATEGORIES_ID) },
    ServicesTab: { screen: CategoriesStack(SERVICES_CATEGORIES_ID) }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "EatTab") {
          return (
            <Icon name="food" type="material-community" size={25} color="red" />
          );
        } else if (routeName === "SleepTab") {
          return (
            <Icon
              name="hotel"
              type="material-community"
              size={25}
              color="red"
            />
          );
        } else if (routeName === "ServicesTab") {
          return (
            <Icon
              name="marker"
              type="material-community"
              size={25}
              color="red"
            />
          );
        } else if (routeName === "TodoTab") {
          return (
            <Icon name="mountains" type="foundation" size={25} color="red" />
          );
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
      }
    })
  }
);
