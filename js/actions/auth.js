// @flow
import axios from "axios";
import { GoogleSignin } from "react-native-google-signin";
import { FBLoginManager } from "react-native-facebook-login";
export const SET_FACEBOOK_CREDENTIALS = "SET_FACEBOOK_CREDENTIALS";
export const SET_GOOGLE_CREDENTIALS = "SET_GOOGLE_CREDENTIALS";
export const SET_USER_PROFILE = "SET_USER_PROFILE";
import { ToastAndroid } from "react-native";

export type FacebookProfileData = {
  first_name: string,
  last_name: string,
  name: string,
  id: string,
  email: string,
  picture: {
    data: { url: string }
  }
};

type GoogleProfileData = {
  idToken: string,
  givenName: string,
  familyName: string,
  id: string,
  accessToken: string,
  photo: string
};

export const setFacebookCredentials = (
  credentials: { userId: string, token: string },
  profile: FacebookProfileData
) => ({
  type: SET_FACEBOOK_CREDENTIALS,
  credentials,
  profile
});

export const setGoogleCredentials = (
  credentials: { userId: string, token: string },
  profile: FacebookProfileData
) => ({
  type: SET_GOOGLE_CREDENTIALS,
  credentials,
  profile
});

export const LOGOUT = "LOGOUT";
export const logout = (provider: "facebook" | "google") => dispatch => {
  const logoutAction = { type: LOGOUT };
  ToastAndroid.show(
    "Login out..." + " Provider: " + provider,
    ToastAndroid.SHORT
  );
  switch (provider) {
    case "google": {
      GoogleSignin.signOut()
        .then(() => {
          ToastAndroid.show("Logged out", ToastAndroid.SHORT);
          dispatch(logoutAction);
        })
        .catch(err => {
          ToastAndroid.show(JSON.stringify(err), ToastAndroid.SHORT);
        });
    }
    case "facebook":
      {
        FBLoginManager.logout(() => {
          ToastAndroid.show("Logged out", ToastAndroid.SHORT);
          dispatch(logoutAction);
        });
      }
      break;
  }
};
