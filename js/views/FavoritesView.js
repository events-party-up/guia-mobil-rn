// @flow
import React, { Component } from "react";
import { StyleSheet, ScrollView, FlatList, Text } from "react-native";
import { connect } from "react-redux";
import flatten from "lodash/flatten";
import styled, { withTheme } from "styled-components";
import Header from "../components/Header";
import ItemThumb from "../components/ItemThumb";
import { getFavoriteItemsIds } from "../reducers";
import getRealm, { itemsToArray } from "../database";

type Props = {
  navigator: Object,
  theme: Object,
  favoriteItemsIds: number[]
};

type State = {
  items: Object[],
  dataState: "loading" | "loaded" | "error"
};

const ViewContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.highContrast};
`;

class FavoritesView extends Component<Props, State> {
  static navigatorStyle = { navBarHidden: true };

  state: State = {
    dataState: "loading",
    items: []
  };

  componentDidMount() {
    const { favoriteItemsIds } = this.props;
    getRealm().then(realm => {
      const items = realm.objects("Item");

      const favoriteItems = flatten(
        favoriteItemsIds.map(id => itemsToArray(items.filtered(`id = ${id}`)))
      );

      this.setState({
        items: itemsToArray(favoriteItems),
        dataState: "loaded"
      });
    });
  }
  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <ItemThumb
      key={item.id}
      id={item.id}
      type="large"
      categoryId={item.category_id}
      image={item.image}
      title={item.name}
      isFavorite={false}
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
    const { dataState } = this.state;
    if (dataState === "loading") {
      return <Text>Loading...</Text>;
    }

    return (
      <FlatList
        initialNumToRender={8}
        numColumns={1}
        style={styles.grid}
        data={this.state.items}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    );
  };

  render() {
    const { theme } = this.props;

    return (
      <ViewContainer style={styles.container}>
        <Header
          title="Favorites"
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
          navItem={{
            back: true,
            onPress: () => this.props.navigator.pop()
          }}
          itemsColor="white"
        />
        <ScrollView style={styles.scrollView}>
          {this.renderItemsGrid()}
        </ScrollView>
      </ViewContainer>
    );
  }
}

const mapStateToProps = state => ({
  favoriteItemsIds: getFavoriteItemsIds(state)
});

export default withTheme(connect(mapStateToProps)(FavoritesView));

// styles
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
