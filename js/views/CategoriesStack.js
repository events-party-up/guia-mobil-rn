import React from "react";
import { StackNavigator } from "react-navigation";
import CategoriesList from "./CategoriesList";
import ItemsListView from "./ItemsListView";
import ItemDetailsView from "./ItemDetailsView";

export default baseCategoryId =>
    StackNavigator(
        {
            HomeCategoryView: {
                screen: props => (
                    <CategoriesList id={baseCategoryId} {...props} />
                )
            },
            CategoriesList: {
                screen: CategoriesList
            },
            ItemsList: {
                screen: ItemsListView
            },
            ItemDetailsView: {
                screen: ItemDetailsView
            }
        },
        {
            navigationOptions: {
                header: null
            }
        }
    );
