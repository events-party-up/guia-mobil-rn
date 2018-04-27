import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import styled from "styled-components";
import moment from "moment";
import UserProfile from "../common/UserProfile";

const Paragraph = styled.Text`
  margin-vertical: 8px;
  font-size: 15;
  text-align: left;
  color: ${props => props.theme.colors.lightText};
`;

const ItemReview = ({ profile_name, rtext, date, profile_img }) => (
  <View style={styles.reviewContainer}>
    <UserProfile
      profileImageUrl={profile_img}
      date={date}
      userName={profile_name}
    />
    <Paragraph>{rtext.trim()}</Paragraph>
  </View>
);

export default ItemReview;

const styles = StyleSheet.create({
  reviewContainer: {},
  paragraph: {
    marginVertical: 8,
    fontSize: 15,
    textAlign: "left"
  }
});
