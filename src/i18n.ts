import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './locales/en.json';
const resources = {en};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: true,
    fallbackLng: 'en',
    resources,
    supportedLngs: ['en'],
  });

  export default i18n;