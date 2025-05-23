import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';

import en from './en.json';
import zh from './zh.json';

const resources = { en: { translation: en }, zh: { translation: zh } };

const locales = Localization.getLocales();
const language = locales.length > 0 ? locales[0].languageCode : 'en'; 

i18n.use(initReactI18next).init({
  resources,
  lng: language, 
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
};

export default i18n;