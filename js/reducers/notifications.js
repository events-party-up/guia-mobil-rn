// @flow
import { Platform } from "react-native";
import type { Action } from "../actions/types";
import * as actions from "../actions";

export type Notification = {
  id: string,
  url: ?string,
  urlTitle: ?string,
  text: string,
  time: number,
  image: ?string
};

export type SeenNotifications = {
  [id: string]: boolean
};

type State = {
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
    case actions.LOAD_NOTIFICATIONS_SUCCESS:
      return state;
    case actions.RECEIVED_PUSH_NOTIFICATION:
      return {
        ...state,
        push: append(action.notification, state.push)
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
