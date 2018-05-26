// @flow

import DeviceInfo from "react-native-device-info";
import type { State } from "../reducers/auth";
import { ToastAndroid } from "react-native";
import type Axios from "axios";

export const ADD_ITEM_REVIEW = "ADD_ITEM_REVIEW";
export const ADD_ITEM_REVIEW_SUCCESS = "ADD_ITEM_REVIEW_SUCCESS";
export const ADD_ITEM_REVIEW_FAILURE = "ADD_ITEM_REVIEW_FAILURE";

type Review = {
  id: number,
  comment: string,
  starRating: string,
  priceRating: string
};

export const sendItemReview = (itemId: number, review: Review) => ({
  type: ADD_ITEM_REVIEW,
  apiCall: (
    apiClient: Axios,
    { itemId, review }: { itemId: number, review: Review },
    getState: () => { auth: State }
  ) => {
    const { auth } = getState();
    if (auth.isAuthenticated) {
      const { userProfile } = auth;
      const { id, comment, starRating, priceRating } = review;
      // TODO: refactor this,
      // use state selectors instead
      const userName = `${userProfile.firstName} ${userProfile.lastName}`;

      const { profilePic, id: userId } = userProfile;
      return apiClient
        .post("/review/post", {
          item_id: id,
          user_id: userId,
          profile_name: userName,
          profile_img: profilePic,
          stars: starRating,
          price: priceRating,
          rtext: comment,
          uuid: DeviceInfo.getUniqueID()
        })
        .catch(err => {
          ToastAndroid.show(JSON.stringify(err), ToastAndroid.LONG);
          console.log(err);
          throw err;
        });
    }
    throw new Error("Only authenticated users can publish reviews");
  },
  payload: { itemId, review }
});

export const LOAD_REVIEWS = "LOAD_REVIEWS";
export const LOAD_REVIEWS_SUCCESS = "LOAD_REVIEWS_SUCCESS";
export const LOAD_REVIEWS_FAILURE = "LOAD_REVIEWS_FAILURE";

export const reviewsUpdate = (options: {}) => ({
  type: LOAD_REVIEWS,
  apiCall: apiClient => {
    return apiClient.get("/update/reviews/0");
  },
  options
});
