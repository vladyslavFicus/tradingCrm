import I18n from 'i18n-js';
import { getBackofficeBrand } from 'config';

export const CRM_LOCALE_PREFIX = 'crm__';
export const ISSUER_DELIMITER = '--';

/**
 * Get locale name without issuer on start
 *
 * @param localeKey
 *
 * @return {*}
 */
export const getUnbrandedLocale = (localeKey: string) => localeKey
  .replace(new RegExp(`.*${ISSUER_DELIMITER}`), '');

/**
 * Get CRM locale key (like crm__ecosales--en)
 *
 * @param localeKey en | ru | ar | etc...
 */
export const getCRMLocaleKey = (localeKey: string = '') => {
  const prefix = `${CRM_LOCALE_PREFIX}${getBackofficeBrand().id}${ISSUER_DELIMITER}`;

  // Return localeKey as is if it's already CRM locale key
  if (localeKey.startsWith(prefix)) {
    return localeKey;
  }

  return `${prefix}${localeKey}`;
};

/**
 * Check if locale from CRM brands locales
 *
 * @param localeKey
 */
export const isCRMLocaleKey = (localeKey: string) => {
  const prefix = `${CRM_LOCALE_PREFIX}${getBackofficeBrand().id}${ISSUER_DELIMITER}`;

  return localeKey.startsWith(prefix);
};

/**
 * Get custom locales defined in CRM brands
 *
 * @return Array of locale keys
 */
export const getCRMLocales = () => Object.keys(I18n.translations).filter(isCRMLocaleKey);


/**
 * Add custom locale to system
 *
 * @param localeKey Name of locale (ru, en, etc...)
 * @param locale Object with provided translations
 */
export const addCRMCustomLocale = (localeKey: string, locale: Record<string, any>) => {
  const customLocaleKey = getCRMLocaleKey(localeKey);

  // Set new locale to list of translations
  I18n.translations[customLocaleKey] = locale;

  // Set fallbacks like brandName_ru -> ru -> en
  I18n.locales[customLocaleKey] = [customLocaleKey, localeKey, 'en'];
};
