import { getI18nObjects, getValueByLocale, Translator } from "lowcoder-sdk";
import * as localeData from "./locales";
import { I18nObjects } from "./locales/types";

export const { trans, language } = new Translator(
  localeData,
  REACT_APP_LANGUAGES
);

export const i18nObjs = getI18nObjects(localeData, REACT_APP_LANGUAGES) as I18nObjects;

// Função getEchartsLocale removida pois estava relacionada ao Hillchart

export function getCalendarLocale() {
  switch (language) {
    case "zh":
      return "zh-cn";
    case "pt":
      return "pt-br";
    default:
      return "en-gb";
  }
}
