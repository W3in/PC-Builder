import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from './locales/en.json';
import viTranslation from './locales/vi.json';
import jaTranslation from './locales/ja.json';

const resources = {
    en: { translation: enTranslation },
    vi: { translation: viTranslation },
    ja: { translation: jaTranslation }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "vi",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;