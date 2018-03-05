// @flow
import React, { Component } from "react";
import { View, StyleSheet, ScrollView, FlatList } from "react-native";
import { connect } from "react-redux";
import type NavigationScreenProp from "react-navigation";
import styled, { withTheme } from "styled-components";
import * as actions from "../actions";
import { itemsSorter } from "../utils";
import Header from "../components/Header";
import ItemThumb from "../components/ItemThumb";
import { ICategory, IItem } from "../models";
import { getItemsForCategoryId } from "../reducers";
import SortButtons from "../components/SortButtons";

type Props = {
  items: any[],
  navigation: NavigationScreenProp,
  category: ICategory,
  theme: Object
};

type State = {
  sortIndex: number
};

const ViewContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.highContrast};
`;

class ItemsListView extends Component<Props, State> {
  state = {
    sortIndex: 0
  };

  sortHandler = index => {
    if (index != this.state.sortIndex) this.setState({ sortIndex: index });
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <ItemThumb
      key={item.id}
      id={item.id}
      type="small"
      categoryId={item.category_id}
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
  );
  renderItemsGrid = (items: IItem[]) => (
    <FlatList
      numColumns={2}
      style={styles.grid}
      data={items}
      extraData={this.state.sortIndex}
      keyExtractor={this.keyExtractor}
      renderItem={this.renderItem}
    />
  );

  render() {
    const { items, category, theme } = this.props;
    const { sortIndex } = this.state;
    const sorterFunc = itemsSorter[sortIndex]();
    const sortedItems = items.sort(sorterFunc);

    return (
      <ViewContainer style={styles.container}>
        <Header
          title={category.name}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
          navItem={{
            back: true,
            onPress: () => this.props.navigation.goBack()
          }}
          itemsColor="white"
        />
        <ScrollView style={styles.scrollView}>
          <SortButtons
            activeSorterIndex={this.state.sortIndex}
            onChangeSorter={this.sortHandler}
          />
          {this.renderItemsGrid(sortedItems)}
        </ScrollView>
      </ViewContainer>
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
  grid: {}
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

export default withTheme(connect(mapStateToProps)(ItemsListView));
