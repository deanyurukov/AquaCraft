import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

import bg from "../locales/bg/translation.json";
import en from "../locales/en/translation.json";

i18next.use(initReactI18next).use(Backend).init({
    debug: true,
    fallbackLng: "en",
    resources: {
        bg: {
            translation: bg
        },
        en: {
            translation: en
        }
    },
});

export default i18next;