// @flow
import * as actions from "../actions";
import type { Action } from "../actions/types";

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

const auth = (
  state: State = {
    isAuthenticated: false
  },
  action: Action
) => {
  switch (action.type) {
    case actions.LOGOUT:
      return { isAuthenticated: false };
    case actions.SET_FACEBOOK_CREDENTIALS:
      return {
        isAuthenticated: true,
        credentials: action.credentials,
        provider: "facebook",
        userProfile: {
          id: action.profile.id,
          firstName: action.profile.first_name,
          lastName: action.profile.last_name,
          profilePic: action.profile.picture.data.url
        }
      };
    case actions.SET_GOOGLE_CREDENTIALS:
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
};

export default auth;
