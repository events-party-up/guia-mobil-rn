// @flow

import I18n from "../i18n";

export const SET_UI_LANG = "SET_UI_LANG";

export function setUILang(langCode: string, langName: string) {
  return (dispatch: Function) => {
    I18n.locale = langCode;
    return dispatch({
      type: SET_UI_LANG,
      code: langCode,
      name: langName
    });
  };
}
