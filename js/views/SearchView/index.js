// @flow

import React, { Component } from "react";
import { View, Text, FlatList } from "react-native";
import { SearchBar, Icon } from "react-native-elements";
import { withTheme } from "styled-components";
import { connect } from "react-redux";
import { sortBy } from "lodash";
import type { Dispatch } from "redux";
import Header from "../../components/Header";
import getRealm, { itemsToArray } from "../../database";
import ItemThumb from "../../components/ItemThumb";
import actions from "../../actions";
import { getSearchTermsHistory } from "../../reducers";

type Props = {
  dispatch: Dispatch,
  searchHistory: SearchRecord[],
  theme: Object,
  navigator: Object
};

type State = {
  isSearching: boolean,
  searchTerm: string,
  searchResults: number
};

class SearchView extends Component<Props, State> {
  static navigatorStyle = { navBarHidden: true, tabBarHidden: true };

  state: State = {
    isSearching: false,
    searchTerm: "",
    searchResults: 0
  };

  async componentDidMount() {
    this.realm = await getRealm();
  }

  realm = null;

  handleSearch = async () => {
    if (this.state.searchTerm) {
      this.setState({ isSearching: true });
      if (this.realm) {
        const items = this.realm
          .objects("Item")
          .filtered(`name CONTAINS[c] '${this.state.searchTerm}'`);
        this.setState({
          searchResults: itemsToArray(items),
          isSearching: false
        });
        this.props.dispatch(actions.recordSearchTerm(this.state.searchTerm));
      }
    }
  };

  hanndleClearText = () => {
    this.setState({ isSearching: false, searchTerm: "", searchResults: [] });
  };

  renderEmptySearchHistory = () => {
    const { searchResults } = this.state;

    if (searchResults && searchResults.length > 0) {
      return null;
    }

    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <View>
          <Icon
            type="fontawesome"
            name="search"
            iconStyle={{
              fontSize: 160,
              color: "#bababa"
            }}
          />
          <Text>Encontrá restaurantes, hostels y lugares para visitar</Text>
        </View>
      </View>
    );
  };

  renderSearchTerm = item => {
    // TODO: improve this
    return <View>{item.term}</View>;
  };

  renderSearchHistoryView = () => {
    const searchTermsSorted = sortBy(this.props.searchHistory, "searchDate");
    return (
      <FlatList
        data={searchTermsSorted}
        keyExtractor={item => `search_${item.term}`}
        renderItem={this.renderSearchTerm}
      />
    );
  };

  renderItem = ({ item }) => (
    <ItemThumb
      key={item.id}
      id={item.id}
      type="small"
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

  renderSearchResults = () => {
    const { searchResults } = this.state;
    if (searchResults) {
      return (
        <FlatList
          data={searchResults}
          keyExtractor={item => `item_${item.id}`}
          renderItem={this.renderItem}
        />
      );
    }
    return null;
  };

  render() {
    const { theme, navigator } = this.props;
    const { isSearching } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Header
          title="Buscador"
          navItem={{
            back: true,
            onPress: () => navigator.dismissModal()
          }}
          itemsColor="white"
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
        />
        <SearchBar
          lightTheme
          showLoadingIcon={isSearching}
          textInputRef={ref => {
            this.searchInput = ref;
          }}
          onSubmitEditing={this.handleSearch}
          onClearText={this.hanndleClearText}
          inputStyle={{ color: "#484848" }}
          clearIcon={{
            type: "font-awesome",
            name: "close",
            color: "#484848"
          }}
          placeholder={"Buscar en Guia Animus"}
          onChangeText={searchTerm =>
            this.setState({ searchTerm: searchTerm.trim() })
          }
          value={this.state.searchTerm}
        />
        {this.renderEmptySearchHistory()}
        {this.renderSearchResults()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  searchHistory: getSearchTermsHistory(state)
});

export default connect(mapStateToProps)(withTheme(SearchView));
