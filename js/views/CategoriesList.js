// @flow
import React, { Component } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { List, ListItem } from "react-native-elements";
import type NavigationScreenProp from "react-navigation";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import { withTheme } from "styled-components";
import * as actions from "../actions";
import { ICategory } from "../models";
import { getCategoriesWithParentId, getCategoryWithId } from "../reducers";
import Header from "../components/Header";
import GuideIcon from "../components/GuideIcon";
import styled from "styled-components";

type Props = {
  categories: ICategory[],
  navigation: NavigationScreenProp,
  updateCategoriesData: Function,
  categoryName: string,
  isRoot: boolean
};

const RowIcon = styled(GuideIcon)`
  color: ${props => props.theme.colors.primary};
`;

class CategoriesList extends Component<Props> {
  static defaultProps = {
    isRoot: false
  };

  componentDidMount() {
    this.props.updateCategoriesData();
  }

  navigateTo = (selectedCategory: ICategory) => {
    if (selectedCategory.children.length) {
      this.props.navigation.navigate("CategoriesList", {
        categories: selectedCategory.children,
        parentCategory: selectedCategory
      });
    } else {
      this.props.navigation.navigate("ItemsList", {
        category: selectedCategory
      });
    }
  };

  renderRow = category => (
    <ListItem
      underlayColor="#939393"
      onPress={() => this.navigateTo(category)}
      key={category.id}
      title={category.name}
      leftIcon={<RowIcon icon={category.icon} />}
    />
  );

  render() {
    const { categoryName, categories, navigation, theme } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title={categoryName}
          navItem={{
            back: true,
            onPress: () => navigation.goBack(null)
          }}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
          itemsColor={"white"}
        />
        <ScrollView>
          <List style={styles.list}>{categories.map(this.renderRow)}</List>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1,
    backgroundColor: "transparent",
    marginTop: 0,
    marginBottom: 60
  },
  row: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderWidth: 1
  }
});

const mapStateToProps = (state, { navigation, id }) => {
  const category = getCategoryWithId(state, id);
  const isRoot = category && category.parent_id === 0;
  console.log({ category });
  if (navigation.getParam("categories")) {
    return {
      isRoot,
      categoryName: navigation.getParam("name", "Categories"),
      categories: navigation.getParam("categories")
    };
  }
  return {
    isRoot,
    categories: getCategoriesWithParentId(state, id),
    categoryName: category ? category.name : "Unknow category"
  };
};

const mapDispatchToProps = (dispatch: Function) => ({
  updateCategoriesData: () => {
    dispatch(actions.categoriesUpdate());
  }
});

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(CategoriesList)
);
