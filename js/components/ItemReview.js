import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import styled from "styled-components";
import moment from "moment";

const Paragraph = styled.Text`
  margin-vertical: 8px;
  font-size: 15;
  text-align: left;
  color: ${props => props.theme.colors.lightText};
`;

const ItemReview = ({ profile_name, rtext, date, profile_img }) => (
  <View style={styles.reviewContainer}>
    <View style={styles.row}>
      <Image
        style={styles.avatar}
        source={{
          uri: profile_img
        }}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{profile_name}</Text>
        <Text style={styles.date}>{moment(date).format("MM YYYY")}</Text>
      </View>
    </View>
    <Paragraph>{rtext}</Paragraph>
  </View>
);

export default ItemReview;

const styles = StyleSheet.create({
  container: {
    margin: 10
  },
  reviewContainer: {},
  info: {
    paddingHorizontal: 10
  },
  avatar: {
    width: 40,
    height: 40,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: "gray"
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  name: {
    fontWeight: "bold"
  },
  date: {
    fontSize: 14,
    color: "#c3c3c3"
  },
  paragraph: {
    marginVertical: 8,
    fontSize: 15,
    textAlign: "left"
  }
});
