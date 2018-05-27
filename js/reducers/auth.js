// @flow

import type { Action } from "../types/actions";

export type State =
  | { isAuthenticated: false }
  | {
      isAuthenticated: true,
      provider: "facebook" | "twitter" | "google",
      userProfile: {
        id: string,
        firstName: string,
        lastName: string,
        profilePic: string
      }
    };

const initalState: State = {
  isAuthenticated: false
};

function auth(state: State = initalState, action: Action) {
  switch (action.type) {
    case "LOGOUT": {
      return { isAuthenticated: false };
    }
    case "SET_FACEBOOK_CREDENTIALS": {
      const { credentials, profile } = action;
      return {
        isAuthenticated: true,
        credentials,
        provider: "facebook",
        userProfile: {
          id: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          profilePic: profile.picture.data.url
        }
      };
    }
    case "SET_GOOGLE_CREDENTIALS":
      return {
        isAuthenticated: true,
        credentials: action.credentials,
        provider: "google",
        userProfile: {
          id: action.profile.id,
          firstName: action.profile.givenName,
          lastName: action.profile.familyName,
          profilePic: action.profile.photo
        }
      };
    default:
      return state;
  }
}

export default auth;
