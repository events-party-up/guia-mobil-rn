// @flow
import React, { Component } from "react";
import { StyleSheet, ScrollView, FlatList, Text } from "react-native";
import { connect } from "react-redux";
import flatten from "lodash/flatten";
import styled, { withTheme } from "styled-components";
import Header from "../components/Header";
import ItemThumb from "../components/ItemThumb";
import { getFavoriteItemsIds } from "../reducers";
import I18n from "../i18n";

type Props = {
  navigator: Object,
  theme: Object
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

  render() {
    const { theme, navigator } = this.props;

    return (
      <ViewContainer style={styles.container}>
        <Header
          title={I18n.t("navigation.reviewcreation.title")}
          leftItem={{
            icon: "window-close",
            iconType: "material-community",
            onPress: () => navigator.dismissModal()
          }}
          itemsColor="white"
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
        />
        <ScrollView style={styles.scrollView} />
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
