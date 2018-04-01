// @flow
import DeviceInfo from "react-native-device-info";
import type Axios from "axios";
import I18n from "../i18n";

export const LOAD_NOTIFICATIONS = "LOAD_NOTIFICATIONS";
export const LOAD_NOTIFICATIONS_SUCCESS = "LOAD_NOTIFICATIONS_SUCCESS";
export const LOAD_NOTIFICATIONS_FAILURE = "LOAD_NOTIFICATIONS";

export function loadUserNotifications(options: any) {
  return {
    type: LOAD_NOTIFICATIONS,
    options,
    apiCall: (client: Axios) => client.get("/notifications")
  };
}

export const RECEIVED_PUSH_NOTIFICATION = "RECEIVED_PUSH_NOTIFICATION";
export function receivePush(notification: any) {
  return {
    type: "RECEIVED_PUSH_NOTIFICATION",
    notification
  };
}

export const REGISTER_GCM_TOKEN = "REGISTER_GCM_TOKEN";
export const REGISTER_GCM_TOKEN_SUCCESS = "REGISTER_GCM_TOKEN_SUCCESS";
export const REGISTER_GCM_TOKEN_FAILURE = "REGISTER_GCM_TOKEN";

type DeviceTokePayload = {
  token: string,
  deviceId: string
};

export function registerDeviceToken(deviceToken: string) {
  return {
    type: REGISTER_GCM_TOKEN,
    apiCall(apiClient: Axios, { token, deviceId }: DeviceTokePayload) {
      return apiClient.post("/gcm/register", {
        token,
        uuid: deviceId
      });
    },
    payload: {
      token: deviceToken,
      deviceId: DeviceInfo.getUniqueID()
    }
  };
}

export const SET_UI_LANG = "SET_UI_LANG";

export function setUILang(langCode, langName) {
  return (dispatch: Function) => {
    I18n.locale = langCode;
    return dispatch({
      type: SET_UI_LANG,
      code: langCode,
      name: langName
    });
  };
}
