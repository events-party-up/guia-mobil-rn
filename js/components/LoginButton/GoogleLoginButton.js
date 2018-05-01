import React, { Component } from "react";
import { GoogleSignin } from "react-native-google-signin";
import { ToastAndroid } from "react-native";
import { connect } from "react-redux";
import IconButton from "./IconButton";
import * as actions from "../../actions";

type GoogleProfileData = {
  idToken: string,
  givenName: string,
  familyName: string,
  id: string,
  accessToken: string,
  photo: string
};

class GoogleLoginButton extends Component {
  googleAuth = async () => {
    try {
      const user: GoogleProfileData = await GoogleSignin.signIn();
      ToastAndroid.show(JSON.stringify(user), ToastAndroid.LONG);
      this.loginUser(user);
    } catch (err) {
      ToastAndroid.show(JSON.stringify(err), ToastAndroid.LONG);
    }
  };

  componentDidMount() {
    this.setupGoogleSignin();
  }

  loginUser = user => {
    this.props.dispatch(
      actions.setGoogleCredentials(
        { userId: user.id, accessToken: user.accessToken },
        user
      )
    );
  };
  async setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        iosClientId: "settings.iOSClientId",
        webClientId:
          "892221673674-rhp9es40jpt84gv1ekfg9skjt4dganuj.apps.googleusercontent.com",
        offlineAccess: false
      });
      const user: GoogleProfileData = await GoogleSignin.currentUserAsync();
    } catch (err) {
      console.log("Google signin error", err.code, err.message);
    }
  }

  render() {
    return (
      <IconButton
        onPress={this.googleAuth}
        iconImageSource={require("../img/login/google.png")}
      />
    );
  }
}

export default connect()(GoogleLoginButton);
