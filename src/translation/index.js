import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Rus from "./rus/translation.js";
import En from "./en/translation.js";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: En,
    },
    ru: {
      translation: Rus,
    },
  },
});

i18n.changeLanguage("en");
