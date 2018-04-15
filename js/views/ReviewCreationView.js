// @flow
import React, { Component } from "react";
import { StyleSheet, ScrollView, View, Text, TextInput } from "react-native";
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

const ALLOWED_CHAR_COUNT = 500;
const ViewContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.highContrast};
`;

type State = {
  dataState: string,
  text: string
};

class FavoritesView extends Component<Props, State> {
  static navigatorStyle = { navBarHidden: true };

  state: State = {
    text: ""
  };

  render() {
    const { theme, navigator } = this.props;
    const charCount = this.state.text.length;

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
        <ScrollView style={styles.scrollView}>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "black"
            }}
            maxLength={ALLOWED_CHAR_COUNT}
            multiline
            autofocus
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
            underlineColorAndroid={"transparent"}
          />
          <View>
            <Text>{`${charCount}/${ALLOWED_CHAR_COUNT}`} </Text>
          </View>
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
