import { useCallback, useMemo, useState } from 'react';
import I18n from 'i18n';
import { useStorage } from 'providers/StorageProvider';
import { getCRMLocaleKey, getCRMLocales, isCRMLocaleKey } from 'utils/locale';

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
  const crmLocales = getCRMLocales();

  // Get languages without current selected language and overrided languages from backoffice brand
  const languages = useMemo(() => Object.keys(I18n.translations)
    .filter(lang => (
      lang !== I18n.locale
        && !(!isCRMLocaleKey(lang) && crmLocales.includes(getCRMLocaleKey(lang)))
    )), [crmLocales]);

  return { isOpen, toggleDropdown, handleSelectLanguage, languages };
};

export default useHeaderLanguages;
