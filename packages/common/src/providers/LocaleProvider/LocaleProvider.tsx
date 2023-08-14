import React, { Fragment, useEffect, useState, useCallback } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import Validator from 'validatorjs';
import Hotkeys from 'react-hot-keys';
import {
  getUnbrandedLocale,
  getCRMLocaleKey,
  getCRMLocales,
} from '../../utils';
import { useStorage } from '../StorageProvider';

type Props = {
  children: React.ReactNode,
};

/**
 * Locale provider
 *
 * Setup current locale for whole application and re-mount application if locale changed in local storage, etc...
 *
 * @param props
 *
 * @constructor
 */
const LocaleProvider = (props: Props) => {
  const [currentLocale, setCurrentLocale] = useState(I18n.locale);
  const [isOriginal, setOriginal] = useState(true);

  // ===== Storage ===== //
  const storage = useStorage();
  const storageLocale = storage.get('locale');

  const fakeTranslation = (scope: any) => scope;

  // Override I18n.t function to show keys instead of translation
  const showKeys = () => {
    I18n.t = isOriginal ? fakeTranslation : I18n.translate;
    setOriginal(!isOriginal);
  };

  // Setup provided locale as current
  const setupLocale = useCallback((locale: string) => {
    // Assign locale only if provided locale exist in translations
    if (Object.keys(I18n.translations).includes(locale)) {
      I18n.locale = locale;
    }

    const unbrandedLocale = getUnbrandedLocale(I18n.locale);

    moment.locale(unbrandedLocale === 'zh' ? 'zh-cn' : unbrandedLocale);

    Validator.useLang(unbrandedLocale);

    // After all manipulations --> setup I18n.locale as current locale
    setCurrentLocale(I18n.locale);
  }, []);

  useEffect(() => {
    // Locale provided from local storage if exist or default locale from I18n library
    const crmLocaleKey = getCRMLocaleKey(storageLocale);
    const crmFallbackKey = getCRMLocaleKey('en');

    // Override previous locale from project to crm brand locale like from "ru" to "crm__ecosales--ru"
    if (getCRMLocales().includes(crmLocaleKey)) {
      storage.set('locale', crmLocaleKey);

      setupLocale(crmLocaleKey);

      return;
    }

    // Leave locale as is if exist in project locales
    if (I18n.translations[storageLocale]) {
      return;
    }

    // Fallback to brand default locale if exist in crm locales
    if (getCRMLocales().includes(crmFallbackKey)) {
      storage.set('locale', crmFallbackKey);
    }
  }, []);

  // Setup locale as current from locale provided from local storage
  useEffect(() => {
    setupLocale(storageLocale);
  }, [storageLocale]);

  return (
    <Fragment key={`${currentLocale}${!isOriginal ? '-keys' : ''}`}>
      <Hotkeys keyName="ctrl+shift+\" filter={() => true} onKeyUp={showKeys} />
      {props.children}
    </Fragment>
  );
};

export default React.memo(LocaleProvider);
