import React from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import classNames from 'classnames';
import Flag from 'react-country-flag';
import { Utils } from '@crm/common';
import I18n from 'i18n-config';
import useHeaderLanguages from 'components/Header/hooks/useHeaderLanguages';
import './HeaderLanguages.scss';

const HeaderLanguages = () => {
  const { isOpen, toggleDropdown, handleSelectLanguage, languages } = useHeaderLanguages();

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
            countryCode={Utils.getCountryCode(Utils.getUnbrandedLocale(I18n.locale)) || ''}
          />

          {Utils.getUnbrandedLocale(I18n.locale)}

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
                countryCode={Utils.getCountryCode(Utils.getUnbrandedLocale(lang)) || ''}
              />

              {Utils.getUnbrandedLocale(lang)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </If>
  );
};

export default React.memo(HeaderLanguages);
