// @flow

import React, { Component } from "react";
import { FBLoginManager } from "react-native-facebook-login";
import { ToastAndroid, Platform } from "react-native";
import { connect } from "react-redux";
import IconButton from "./IconButton";
import * as actions from "../../actions";

import type { Dispatch } from "../../actions/types";

type FacebookProfileData = {
  first_name: string,
  last_name: string,
  name: string,
  id: string,
  email: string,
  picture: {
    data: { url: string }
  }
};

type Props = {
  dispatch: Dispatch
};

class FacebookLoginButton extends Component<Props, {}> {
  componentDidMount() {
    const loginBehavior =
      Platform.OS === "ios"
        ? FBLoginManager.LoginBehaviors.Web
        : FBLoginManager.LoginBehaviors.WebView;

    FBLoginManager.setLoginBehavior(loginBehavior);
  }
  fbAuth() {
    FBLoginManager.loginWithPermissions(
      ["public_profile", "email"],
      (err, data) => {
        if (err) {
          console.log("Login was cancelled");
          ToastAndroid.show("Login failed", ToastAndroid.SHORT);
        } else {
          console.log("Login was successful with permissions: " + data.profile);
          const { profile: strProfile, credentials } = data;
          const profile: FacebookProfileData = JSON.parse(strProfile);

          const { userId, token } = credentials;
          this.props.dispatch(
            actions.setFacebookCredentials(credentials, profile)
          );
        }
      }
    );
  }

  render() {
    return (
      <IconButton
        onPress={this.fbAuth.bind(this)}
        iconImageSource={require("../img/login/facebook.png")}
      />
    );
  }
}

export default connect()(FacebookLoginButton);
