import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Linking,
  Platform,
  Share,
  Image
} from "react-native";
import moment from "moment";

const UserProfile = ({ date, profileImageUrl, userName }) => (
  <View style={styles.row}>
    <View style={styles.avatarContainer}>
      <Image
        style={styles.avatar}
        source={{
          uri: profileImageUrl
        }}
      />
    </View>
    <View style={styles.info}>
      <Text style={styles.name}>{userName}</Text>
      <Text style={styles.date}>{moment(date).format("DD.MM.YYYY")}</Text>
    </View>
  </View>
);

export default UserProfile;

const styles = StyleSheet.create({
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
  avatarContainer: {
    width: 40,
    height: 40,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "gray",
    overflow: "hidden"
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
  }
});
