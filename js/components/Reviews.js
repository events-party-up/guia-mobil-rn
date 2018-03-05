import React from "react";
import { View } from "react-native";
import ItemReview from "./ItemReview";
import { Heading3 } from "./common/Text";

const Reviews = ({ reviews }) => {
  if (reviews && reviews.length)
    return (
      <View style={{ paddingHorizontal: 20 }}>
        <Heading3>Evaluaciones</Heading3>
        {reviews.map(review => <ItemReview key={review.id} {...review} />)}
      </View>
    );
  return null;
};

export default Reviews;