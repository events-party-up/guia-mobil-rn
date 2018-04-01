import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Heading2 } from "../common/Text";
import styled from "styled-components";
import moment from "moment";

function formatNotificationDate(date) {
  const formatStr = "YY/MM/DD - HH:mm";
  return moment(date).format(formatStr);
}

const NotificationCard = ({ title, content, date }) => {
  return (
    <View style={styles.card}>
      <Heading2 ellipsizeMode="tail" numberOfLines={2}>
        {title}
      </Heading2>
      <View style={styles.textContainer}>
        <Text>{content}</Text>
      </View>
      <View>
        <Text style={styles.dateText}> {formatNotificationDate(date)}</Text>
      </View>
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  dateText: {
    color: "#0a71b3"
  },
  textContainer: {
    paddingVertical: 10
  },
  card: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#939393"
  }
});
