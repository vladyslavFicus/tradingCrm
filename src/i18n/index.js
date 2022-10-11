import I18n from 'i18n-js';
import 'moment/locale/zh-cn';
import en from './en.json';
// import zh from './zh.json';

I18n.fallbacks = true;

I18n.translations = { en };

I18n.defaultLocale = 'en';

/**
 *
 * If there is no translation in the file with translations for the value.
 * Instead of the error [missing "EN.Your value" translation]
 * the transferred value will be displayed - "Your value"
 *
*/
I18n.missingTranslation = value => value;

export default I18n;
