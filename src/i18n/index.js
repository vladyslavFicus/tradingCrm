import I18n from 'i18n-js';

// Import moment locales
import 'moment/locale/zh-cn';

// Import application locales
import en from './en.json';
import zh from './zh.json';

I18n.translations = {
  en,
  zh,
};

I18n.defaultLocale = 'en';

export default I18n;
