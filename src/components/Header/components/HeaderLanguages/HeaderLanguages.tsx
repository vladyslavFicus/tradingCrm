import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import classNames from 'classnames';
import Flag from 'react-country-flag';
import I18n from 'i18n';
import { withStorage } from 'providers/StorageProvider';
import { getCountryCode } from 'utils/countryList';
import { getCRMLocaleKey, getCRMLocales, getUnbrandedLocale, isCRMLocaleKey } from 'utils/locale';
import './HeaderLanguages.scss';

type Props = {
  storage: Storage,
}

const HeaderLanguages = (props: Props) => {
  const { storage } = props;

  const [isOpen, setOpen] = useState(false);

  const toggleDropdown = () => setOpen(value => !value);
  const handleSelectLanguage = (locale: string) => {
    toggleDropdown();
    storage.set('locale', locale);
  };

  // Get custom languages defined on backoffice brand
  const crmLocales = getCRMLocales();

  // Get languages without current selected language and overrided languages from backoffice brand
  const languages = Object.keys(I18n.translations)
    .filter(lang => (
      lang !== I18n.locale
      && !(!isCRMLocaleKey(lang) && crmLocales.includes(getCRMLocaleKey(lang)))
    ));

  return (
    <If condition={!!languages.length}>
      <Dropdown
        className={classNames('HeaderLanguages', { 'HeaderLanguages--is-open': isOpen })}
        toggle={toggleDropdown}
        isOpen={isOpen}
      >
        <DropdownToggle className="HeaderLanguages__toggle" tag="div">
          <Flag
            svg
            className="HeaderLanguages__flag"
            countryCode={getCountryCode(getUnbrandedLocale(I18n.locale)) || ''}
          />

          {getUnbrandedLocale(I18n.locale)}

          <i className="HeaderLanguages__caret fa fa-angle-down" />
        </DropdownToggle>

        <DropdownMenu className="HeaderLanguages__list">
          {languages.map(lang => (
            <DropdownItem
              key={lang}
              className="HeaderLanguages__item"
              onClick={() => handleSelectLanguage(lang)}
              value={lang}
            >
              <Flag
                svg
                className="HeaderLanguages__flag"
                countryCode={getCountryCode(getUnbrandedLocale(lang)) || ''}
              />

              {getUnbrandedLocale(lang)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </If>
  );
};

export default React.memo(withStorage(HeaderLanguages));
