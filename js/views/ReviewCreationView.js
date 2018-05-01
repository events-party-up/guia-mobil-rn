// @flow

import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  ToastAndroid,
  Keyboard
} from "react-native";
import { connect } from "react-redux";
import { Rating } from "react-native-elements";
import { Heading2 } from "../components/common/Text";
import styled, { withTheme } from "styled-components";
import Header from "../components/Header";
import ReviewCard from "../components/ReviewCard";
import { getFavoriteItemsIds } from "../reducers";
import I18n from "../i18n";
import * as actions from "../actions";
import type { Dispatch } from "../actions/types";

const STAR_IMAGE = require("../components/img/ratings/star.png");
const CIRCLE_IMAGE = require("../components/img/ratings/circle.png");

type Props = {
  navigator: Object,
  theme: Object,
  dispatch: Dispatch,
  itemId: number
};

const ViewContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.highContrast};
`;

type State = {
  reviewText: string,
  starRating?: number,
  priceRating?: number
};

class ReviewCreationView extends Component<Props, State> {
  static navigatorStyle = { navBarHidden: true };

  state: State = {
    reviewText: ""
  };

  starRatingCompleted = rating => {
    this.setState({ starRating: rating });
  };

  priceRatingCompleted = rating => {
    this.setState({ priceRating: rating });
  };

  submitRating = async () => {
    ToastAndroid.show("Review sent!", ToastAndroid.SHORT);
    Keyboard.dismiss();
    const { itemId } = this.props;
    await this.props.dispatch(
      actions.sendItemReview(itemId, {
        comment: this.state.reviewText,
        starRating: this.state.starRating,
        priceRating: this.state.priceRating
      })
    );

    ToastAndroid.show("Review sent!", ToastAndroid.SHORT);
    this.props.navigator.dismissModal();
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
          rightItem={{
            layout: "title",
            title: "Publish",
            onPress: this.submitRating
          }}
          itemsColor="white"
          backgroundColor={theme.colors.primary}
          titleColor={theme.colors.highContrast}
        />
        <ScrollView style={styles.scrollView}>
          <View style={styles.starRatingCompleted}>
            <Heading2>Valoración</Heading2>
            <Rating
              type="custom"
              ratingColor="#0A71B3"
              ratingBackgroundColor="white"
              ratingImage={STAR_IMAGE}
              fractions={1}
              imageSize={60}
              startingValue={0}
              ratingCount={5}
              onFinishRating={this.priceRatingCompleted}
              style={styles.rating}
            />
          </View>
          <View style={styles.ratingContainer}>
            <Heading2>Precio</Heading2>
            <Rating
              type="custom"
              ratingColor="#0A71B3"
              ratingBackgroundColor="white"
              ratingImage={CIRCLE_IMAGE}
              fractions={1}
              imageSize={60}
              ratingCount={5}
              startingValue={0}
              onFinishRating={this.ratingCompleted}
              style={styles.rating}
            />
          </View>

          <ReviewCard
            reviewText={this.state.reviewText}
            onChangeText={reviewText => this.setState({ reviewText })}
          />
        </ScrollView>
      </ViewContainer>
    );
  }
}

const mapStateToProps = state => ({
  favoriteItemsIds: getFavoriteItemsIds(state),
  userProfile: state.auth.userProfile
});

export default withTheme(connect(mapStateToProps)(ReviewCreationView));

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 20
  },
  rating: {
    alignSelf: "center",
    paddingVertical: 10
  },
  ratingContainer: {
    marginVertical: 10
  }
});
