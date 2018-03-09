// @flow
import React, { Component } from "react";
import { View, StyleSheet, ScrollView, FlatList, Text } from "react-native";
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
import getRealm, { itemsToArray } from "../database";

type Props = {
  navigation: NavigationScreenProp,
  category: ICategory,
  theme: Object
};

type State = {
  sortIndex: number,
  items?: Object,
  loading: boolean,
  itemCount: number
};

const ViewContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.highContrast};
`;

class ItemsListView extends Component<Props, State> {
  state = {
    sortIndex: 0,
    itemCount: 0,
    loading: true
  };

  componentDidMount() {
    const { category } = this.props;
    getRealm().then(realm => {
      const items = realm
        .objects("Item")
        .filtered(`category_id = ${category.id}`);
      this.setState({
        itemCount: items.length,
        items,
        loading: false
      });
    });
  }
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
          item
        })
      }
    />
  );
  renderItemsGrid = () => {
    const { loading } = this.state;
    if (loading) {
      return <Text>Loading...</Text>;
    }
    const { sortIndex, items } = this.state;
    const sorterFunc = itemsSorter[sortIndex]();
    const sortedItems = itemsToArray(items.sorted("name"));
    return (
      <FlatList
        numColumns={2}
        style={styles.grid}
        data={sortedItems}
        extraData={this.state.sortIndex}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    );
  };

  render() {
    const { category, theme } = this.props;
    return (
      <ViewContainer style={styles.container}>
        <Header
          title={`${category.name} ${this.state.itemCount}`}
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
          {this.renderItemsGrid()}
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
      category
    };
  }
};

export default withTheme(connect(mapStateToProps)(ItemsListView));
