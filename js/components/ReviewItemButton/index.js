import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { connect } from "react-redux";
import IconButton from "../common/IconButton";

function onCreateReviewPress(itemId, isAuthenticated, navigator) {
  if (isAuthenticated) {
    navigator.showModal({
      screen: "animus.ReviewCreationView",
      passProps: {
        itemId
      }
    });
  } else {
    navigator.showModal({
      screen: "animus.SocialLoginView",
      passProps: {
        itemId
      }
    });
  }
}

const ReviewItemButton = ({
  isAuthenticated,
  navigator,
  itemId
}: {
  isAuthenticated: boolean,
  navigator: {},
  itemId: string
}) => {
  return (
    <TouchableOpacity
      style={styles.actionWrapper}
      onPress={() => onCreateReviewPress(itemId, isAuthenticated, navigator)}
    >
      <IconButton imageSource={require("../img/comment_icon.png")} />
      <Text>Calificar</Text>
    </TouchableOpacity>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(ReviewItemButton);

const styles = StyleSheet.create({
  actionWrapper: {
    flexDirection: "row",
    alignItems: "center"
  }
});
