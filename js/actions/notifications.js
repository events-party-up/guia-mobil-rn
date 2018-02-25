export const LOAD_NOTIFICATIONS = "LOAD_NOTIFICATIONS";
export const LOAD_NOTIFICATIONS_SUCCESS = "LOAD_NOTIFICATIONS_SUCCESS";
export const LOAD_NOTIFICATIONS_FAILURE = "LOAD_NOTIFICATIONS";

export function loadUserNotifications(options) {
  return {
    type: LOAD_NOTIFICATIONS,
    options,
    apiCall: client => client.get("/notifications")
  };
}

export const RECEIVED_PUSH_NOTIFICATION = "RECEIVED_PUSH_NOTIFICATION";
export function receivePush(notification) {
  return {
    type: "RECEIVED_PUSH_NOTIFICATION",
    notification
  };
}
