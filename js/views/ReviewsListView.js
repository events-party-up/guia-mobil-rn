// @flow
import * as React from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { IReview } from "../models";

type Props = {
  reviews?: Array<IReview>,
  itemId: number
};

const ReviewsListView = (props: Props) => {
  const { reviews } = props;
  if (reviews) {
    return (
      <View>
        {reviews.map(review => (
          <View key={review.id}>
            <Text>{review.rtext}</Text>
            <Text>{review.createdAt}</Text>
          </View>
        ))}
      </View>
    );
  }
  return null;
};

ReviewsListView.defaultProps = {
  reviews: []
};

const mapStateToProps = (state, { itemId }: Props) => ({
  reviews: state.comments[itemId] || []
});

export default connect(mapStateToProps)(ReviewsListView);
