import { useCallback, useMemo, useState } from 'react';
import { Utils, useStorage } from '@crm/common';
import I18n from 'i18n';

const useHeaderLanguages = () => {
  const [isOpen, setOpen] = useState(false);

  // ===== Storage ===== //
  const storage = useStorage();

  const toggleDropdown = useCallback(() => setOpen(value => !value), []);
  const handleSelectLanguage = useCallback((locale: string) => {
    toggleDropdown();
    storage.set('locale', locale);
  }, []);

  // Get custom languages defined on backoffice brand
  const crmLocales = Utils.getCRMLocales();

  // Get languages without current selected language and overrided languages from backoffice brand
  const languages = useMemo(() => Object.keys(I18n.translations)
    .filter(lang => (
      lang !== I18n.locale
        && !(!Utils.isCRMLocaleKey(lang) && crmLocales.includes(Utils.getCRMLocaleKey(lang)))
    )), [crmLocales]);

  return { isOpen, toggleDropdown, handleSelectLanguage, languages };
};

export default useHeaderLanguages;
