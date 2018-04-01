import Snackbar from "react-native-snackbar";
import defer from "lodash/defer";
import curry from "lodash/curry";
import * as actions from "../actions";

import I18n from "../i18n";

export function toggleFavorite(dispatch, id, isFavorite) {
  const title = isFavorite
    ? I18n.t("items.unsave.title")
    : I18n.t("items.save.title");
  const timerId = defer(() => {
    dispatch(actions.toggleFavourite(id));
  }, 3000);

  Snackbar.show({
    title,
    duration: Snackbar.LENGTH_SHORT,
    action: {
      title: I18n.t("items.save.undo"),
      color: "green",
      onPress: () => {
        clearTimeout(timerId);
      }
    }
  });
}
