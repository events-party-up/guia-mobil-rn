// @flow
import React, { Component } from "react";
import { StyleSheet, View, ScrollView, FlatList } from "react-native";
import { List, ListItem } from "react-native-elements";
import { connect } from "react-redux";
import styled, { withTheme } from "styled-components";
import * as actions from "../actions";
import { ICategory } from "../models";
import { getCategoriesWithParentId, getCategoryWithId } from "../reducers";
import Header from "../components/Header";
import GuideIcon from "../components/GuideIcon";

type Props = {
  categories: ICategory[],
  navigator: Object,
  updateCategoriesData: Function,
  categoryName: string,
  theme: Object,
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
      this.props.navigator.push({
        screen: "animus.CategoriesList",
        passProps: {
          id: selectedCategory.id,
          categories: selectedCategory.children,
          parentCategory: selectedCategory
        }
      });
    } else {
      this.props.navigator.push({
        screen: "animus.ItemsListView",
        passProps: {
          category: selectedCategory
        }
      });
    }
  };

  renderRow = ({ item: category }) => (
    <ListItem
      hideChevron
      underlayColor="lightgray"
      onPress={() => this.navigateTo(category)}
      title={category.name}
      containerStyle={{
        paddingHorizontal: 0
      }}
      topDivider={false}
      bottomDivider={false}
      titleStyle={{ fontFamily: "nunito", color: "#484848" }}
      leftIcon={<RowIcon icon={category.icon} />}
    />
  );

  render() {
    const { categoryName, categories, navigator, theme, isRoot } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title={categoryName}
          navItem={{
            back: true,
            onPress: () =>
              isRoot ? navigator.switchToTab({ tabIndex: 0 }) : navigator.pop()
          }}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
          itemsColor="white"
        />

        <FlatList
          style={styles.list}
          data={categories}
          renderItem={this.renderRow}
          keyExtractor={category => `category_${category.id}`}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  list: {},
  row: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderWidth: 1
  }
});

// hide native nabvar
CategoriesList.navigatorStyle = { navBarHidden: true };

const mapStateToProps = (state, { id, categories }) => {
  const category = getCategoryWithId(state, id);
  const isRoot = category && category.parent_id === 0;
  return {
    isRoot,
    categories: categories || getCategoriesWithParentId(state, id),
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
