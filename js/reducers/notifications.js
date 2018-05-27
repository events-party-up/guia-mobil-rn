// @flow

import { Platform } from "react-native";
import type { Action } from "../types/actions";

export type Notification = {
  title: string,
  content: string,
  id: string,
  imageUrl: string,
  date: number
};

export type SeenNotifications = {
  [id: string]: boolean
};

export type State = {
  enabled: ?boolean, // null = no answer
  registered: boolean,
  push: Array<Notification>,
  seen: SeenNotifications
};

const initialState = {
  push: [],
  enabled: Platform.OS === "ios" ? null : true,
  registered: false,
  seen: {}
};

export default function notifications(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case "RECEIVED_PUSH_NOTIFICATION":
      return {
        ...state,
        seen: {
          ...state.seen,
          [action.notification.id]: false
        },
        push: append({ ...action.notification, date: Date.now() }, state.push)
      };
    case "NOTIFICATION_SEEN":
      return {
        ...state,
        seen: { ...state.seen, [action.notificationId]: true }
      };
    default:
      return state;
  }
}

function append(item, list) {
  if (list.find(it => it.id === item.id)) {
    return list;
  }
  return [...list, item];
}

export function getNotificationWithId(
  state: State,
  notificationId: string | number
): ?Notification {
  return state.push.find(notification => notification.id === notificationId);
}
