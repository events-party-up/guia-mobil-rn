import React, { Component } from "react";
import { View, Text, FlatList } from "react-native";
import { SearchBar, Icon } from "react-native-elements";
import { withTheme } from "styled-components";
import Header from "../../components/Header";
import getRealm, { itemsToArray } from "../../database";
import ItemThumb from "../../components/ItemThumb";

class SearchView extends Component {
  static navigatorStyle = { navBarHidden: true, tabBarHidden: true };
  static defaultProps = {
    searchHistory: []
  };

  state = {
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
      }
    }
  };

  hanndleClearText = () => {
    this.setState({ isSearching: false, searchTerm: "" });
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

export default withTheme(SearchView);
