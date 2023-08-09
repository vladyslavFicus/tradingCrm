import { Config } from '@crm/common';

/**
 * Download all locales from S3 provided in CRM config
 *
 * @param localeKeys Array of locale keys, like ['en', 'zh', 'ar]
 *
 * @return Object Map of locales, like { "en": { "SIDEBAR": { "MENU": "Menu" } } }
 */
export const downloadLocalesFromS3 = async (localeKeys: Array<string> = []) => {
  const locales: Record<string, any> = {};

  // Download all provided locales from S3
  const localePromises = localeKeys.map(async (locale: string) => {
    const response = await fetch(Config.getCrmBrandStaticFileUrl(`locales/${locale}.json`));

    if (response.status === 200) {
      locales[locale] = await response.json();
    }
  });

  // Wait while all locales will be loaded
  await Promise.allSettled(localePromises);

  return locales;
};
