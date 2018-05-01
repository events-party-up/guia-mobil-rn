import React, { Component } from "react";
import { FBLogin, FBLoginManager } from "react-native-facebook-login";
import { TouchableOpacity, Image, View, ToastAndroid } from "react-native";
import { connect } from "react-redux";
import * as actions from "../actions";

class TwitterLoginButton extends Component {
  fbAuth() {
    FBLoginManager.loginWithPermissions(
      ["public_profile", "email"],
      (err, data) => {
        if (err) {
          console.log("Login was cancelled");
        } else {
          console.log("Login was successful with permissions: " + data.profile);

          const { id, name, email, picture } = JSON.parse(data.profile);
          ToastAndroid.show(JSON.stringify(picture), ToastAndroid.SHORT);
        }
      }
    );
  }
  render() {
    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={this.fbAuth.bind(this)}>
          <Image source={require("./img/login/twitter.png")} />
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = {
  buttonContainer: {
    width: 60,
    height: 60,
    backgroundColor: "white",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  }
};

const mapDispatchToProps = dispatch => ({
  onLogin({ credentials }) {
    console.log({ credentials });
    dispatch(actions.setFacebookCredentials(credentials));
  },
  onLogout() {
    dispatch(actions.logout());
  },
  onLoginFound({ credentials }) {
    console.log({ credentials });
    dispatch(actions.setFacebookCredentials(credentials));
  },
  onLoginNotFound() {
    dispatch(actions.logout());
  }
});

export default connect(null, mapDispatchToProps)(TwitterLoginButton);
