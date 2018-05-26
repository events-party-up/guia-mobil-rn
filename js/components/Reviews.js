// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import ItemReview from "./ItemReview";
import { Heading3 } from "./common/Text";

type Review = {
  id: string
};

type Props = {
  reviews: Review[]
};

const Reviews = ({ reviews }: Props) => {
  if (reviews && reviews.length)
    return (
      <View style={styles.container}>
        <Heading3>Evaluaciones</Heading3>
        {reviews.map(review => <ItemReview key={review.id} {...review} />)}
      </View>
    );
  return (
    <View style={styles.container}>
      <Heading3>No hay evaluaciones aun. Sé el primero en hacerlo.</Heading3>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 10
  }
});

export default Reviews;
