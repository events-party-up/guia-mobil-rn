import React from "react";
import { TabNavigator } from "react-navigation";
import CategoriesStack from "./CategoriesStack";

const EAT_CATEGORIES_ID = 30;
const SLEEP_CATEGORIES_ID = 1;
const TODO_CATEGORIES_ID = 36;
const SERVICES_CATEGORIES_ID = 46;

export default TabNavigator({
  EatTab: { screen: CategoriesStack(EAT_CATEGORIES_ID) },
  SleepTab: { screen: CategoriesStack(SLEEP_CATEGORIES_ID) },
  TodoTab: { screen: CategoriesStack(TODO_CATEGORIES_ID) },
  ServicesTab: { screen: CategoriesStack(SERVICES_CATEGORIES_ID) }
});
