// @flow
import React, { PureComponent } from "react";
import { StyleSheet, ScrollView, FlatList, Text } from "react-native";
import { connect } from "react-redux";
import styled, { withTheme } from "styled-components";
import * as actions from "../actions";
import { itemsSorter } from "../utils";
import Header from "../components/Header";
import ItemThumb from "../components/ItemThumb";
import { ICategory } from "../models";
import { getItemsForCategoryId, getFavoriteItemsIds } from "../reducers";
import SortButtons from "../components/SortButtons";
import getRealm, { itemsToArray } from "../database";

type Props = {
  navigator: Object,
  category: ICategory,
  theme: Object,
  favoritesIds: number[]
};

type State = {
  sortIndex: number,
  items: Object[],
  loading: boolean,
  itemCount: number
};

const ViewContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.highContrast};
`;

class ItemsListView extends PureComponent<Props, State> {
  state = {
    sortIndex: 0,
    itemCount: 0,
    loading: true,
    items: []
  };

  componentDidMount() {
    const { category } = this.props;
    getRealm().then(realm => {
      const items = realm
        .objects("Item")
        .filtered(`category_id = ${category.id}`);
      this.setState({
        itemCount: items.length,
        items: itemsToArray(items),
        loading: false
      });
    });
  }

  sortHandler = index => {
    if (index !== this.state.sortIndex) this.setState({ sortIndex: index });
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
      isFavorite={this.props.favoritesIds.indexOf(item.id) >= 0}
      coord={item.coord}
      onPress={() =>
        this.props.navigator.push({
          screen: "animus.ItemDetailsView",
          passProps: {
            item
          }
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
    const sorterFunc = itemsSorter[sortIndex](this.props.userLocation);
    const sortedItems = items.slice().sort(sorterFunc);

    return (
      <FlatList
        initialNumToRender={8}
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
          title={`${category.name} (${this.state.itemCount})`}
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
          navItem={{
            back: true,
            onPress: () => this.props.navigator.pop()
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

const mapStateToProps = state => ({
  favoritesIds: getFavoriteItemsIds(state),
  userLocation: state.location.coords
});

ItemsListView.navigatorStyle = { navBarHidden: true };

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  }
});

export default withTheme(connect(mapStateToProps)(ItemsListView));
