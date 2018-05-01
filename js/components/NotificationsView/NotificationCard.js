// @flow
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Heading2 } from "../common/Text";
import moment from "moment";

function formatNotificationDate(date) {
  const formatStr = "DD/MM/YYYY - HH:mm";
  return moment(date).format(formatStr);
}

const NotificationCard = ({
  title,
  content,
  date,
  onPress
}: {
  title: string,
  content: string,
  date: string,
  onPress: () => void
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
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
    </TouchableOpacity>
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
    borderColor: "#939393",
    marginHorizontal: 16
  }
});
