// @flow
import React, { Component } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { connect } from "react-redux";
import type NavigationScreenProp from "react-navigation";
import * as actions from "../actions";
import Header from "../components/Header";
import ItemThumb from "../components/ItemThumb";
import { ICategory, IItem } from "../models";
import { getItemsForCategoryId } from "../reducers";

type Props = {
  items: any[],
  navigation: NavigationScreenProp,
  category: ICategory
};

class ItemsListView extends Component<Props> {
  renderItemsGrid = (items: IItem[]) => (
    <View style={styles.grid}>
      {items.map(item => (
        <ItemThumb
          key={item.id}
          id={item.id}
          type="small"
          category={item.category_id}
          image={item.image}
          title={item.name}
          isFavorite={false}
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

  render() {
    const { items, category } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title={category.name}
          navItem={{
            back: true,
            onPress: () => this.props.navigation.goBack()
          }}
        />
        <ScrollView style={styles.scrollView}>
          {this.renderItemsGrid(items)}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  }
});

const mapStateToProps = (state, { navigation }) => {
  if (navigation.getParam("category")) {
    const category = navigation.getParam("category");
    return {
      category,
      items: getItemsForCategoryId(state, category.id)
    };
  }
  return {
    items: []
  };
};

export default connect(mapStateToProps)(ItemsListView);
