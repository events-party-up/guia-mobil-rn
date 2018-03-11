import I18n from "react-native-i18n";
import es from "./locales/es";
import en from "./locales/en";
import pt from "./locales/pt";

I18n.fallbacks = true;
I18n.locale = "es";

I18n.translations = {
  en,
  es,
  pt
};

export default I18n;
