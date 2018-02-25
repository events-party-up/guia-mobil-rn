// @flow
import React, { Component } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { List, ListItem } from "react-native-elements";
import type NavigationScreenProp from "react-navigation";
import { connect } from "react-redux";
import * as actions from "../actions";
import { ICategory } from "../models";
import { getCategoriesWithParentId, getCategoryWithId } from "../reducers";
import Header from "../components/Header";

type Props = {
  categories: ICategory[],
  navigation: NavigationScreenProp,
  updateCategoriesData: Function,
  categoryName: string,
  isRoot: boolean
};

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

  goBack = () => {
    const { navigation, isRoot } = this.props;
    if (isRoot) {
      navigation.goBack(null);
    } else {
      navigation.goBack();
    }
  };

  renderRow = category => (
    <ListItem
      onPress={() => this.navigateTo(category)}
      key={category.id}
      title={category.name}
    />
  );
  render() {
    const { categoryName, categories } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title={categoryName}
          navItem={{
            back: true,
            onPress: this.goBack
          }}
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
  if (navigation.getParams("categories")) {
    return {
      isRoot,
      categoryName: navigation.getParam("name", "Categories"),
      categories: navigation.getParams("categories")
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesList);
