// @flow

import type Axios from "axios";
import DeviceInfo from "react-native-device-info";
import { Platform } from "react-native";

export const LOAD_NOTIFICATIONS = "LOAD_NOTIFICATIONS";
export const LOAD_NOTIFICATIONS_SUCCESS = "LOAD_NOTIFICATIONS_SUCCESS";
export const LOAD_NOTIFICATIONS_FAILURE = "LOAD_NOTIFICATIONS";

export type OneSignalNotification = {
  payload: {
    fromProjectNumber: string,
    groupMessage: string,
    lockScreenVisibility: number, // 1
    rawPayload: string, //  json string
    additionalData: {
      title: string,
      content: string,
      id: string,
      imageUrl: string
    },
    body: string,
    title: string,
    priority: number, // 5
    notificationID: string
  },
  displayType: number,
  androidNotificationId: number,
  shown: boolean,
  isAppInFocus: boolean
};

export function loadUserNotifications(options: any) {
  return {
    type: LOAD_NOTIFICATIONS,
    options,
    apiCall: (client: Axios) => client.get("/notifications")
  };
}

export const RECEIVED_PUSH_NOTIFICATION = "RECEIVED_PUSH_NOTIFICATION";

export function receivePush(notification: OneSignalNotification) {
  return {
    type: RECEIVED_PUSH_NOTIFICATION,
    notification: notification.payload.additionalData
  };
}

export const NOTIFICATION_SEEN = "NOTIFICATION_SEEN";

export function notificationSeen(notificationId: number | string) {
  return { type: NOTIFICATION_SEEN, notificationId };
}

export const REGISTER_GCM_TOKEN = "REGISTER_GCM_TOKEN";
export const REGISTER_GCM_TOKEN_SUCCESS = "REGISTER_GCM_TOKEN_SUCCESS";
export const REGISTER_GCM_TOKEN_FAILURE = "REGISTER_GCM_TOKEN";

type DeviceTokePayload = {
  token: string,
  deviceId: string
};

export function registerDeviceToken(
  deviceToken: string,
  oneSignalUserId: string
) {
  return {
    type: REGISTER_GCM_TOKEN,
    apiCall(apiClient: Axios, { token, deviceId }: DeviceTokePayload) {
      return apiClient.post("/gcm/register", {
        token,
        uuid: deviceId,
        oneSignalUserId,
        platform: Platform.OS
      });
    },
    payload: {
      token: deviceToken,
      deviceId: DeviceInfo.getUniqueID()
    }
  };
}
