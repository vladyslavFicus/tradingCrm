import React, { PureComponent } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import Flag from 'react-country-flag';
import I18n from 'i18n';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { getCountryCode } from 'utils/countryList';
import { getUnbrandedLocale, getCRMLocaleKey, getCRMLocales, isCRMLocaleKey } from 'utils/locale';
import './HeaderLanguages.scss';

class HeaderLanguages extends PureComponent {
  static propTypes = {
    storage: PropTypes.storage.isRequired,
  };

  state = {
    isOpen: false,
  };

  handleToggleIsOpenState = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  selectLanguage = (e) => {
    const { value } = e.target;
    const { storage } = this.props;

    this.handleToggleIsOpenState();
    storage.set('locale', value);
  };

  render() {
    const { isOpen } = this.state;

    // Get custom languages defined on backoffice brand
    const crmLocales = getCRMLocales();

    // Get languages without current selected language and overrided languages from backoffice brand
    const languages = Object.keys(I18n.translations)
      .filter(lang => (
        lang !== I18n.locale
        && !(!isCRMLocaleKey(lang) && crmLocales.includes(getCRMLocaleKey(lang)))
      ));

    return (
      <If condition={languages.length > 0}>
        <Dropdown
          className={classNames('HeaderLanguages', { 'HeaderLanguages--is-open': isOpen })}
          toggle={this.handleToggleIsOpenState}
          isOpen={isOpen}
        >
          <DropdownToggle className="HeaderLanguages__toggle" tag="div">
            <Flag svg className="HeaderLanguages__flag" countryCode={getCountryCode(getUnbrandedLocale(I18n.locale))} />
            {getUnbrandedLocale(I18n.locale)}
            <i className="HeaderLanguages__caret fa fa-angle-down" />
          </DropdownToggle>
          <DropdownMenu className="HeaderLanguages__list">
            {languages.map(lang => (
              <DropdownItem
                key={lang}
                className="HeaderLanguages__item"
                onClick={this.selectLanguage}
                value={lang}
              >
                <Flag
                  svg
                  className="HeaderLanguages__flag"
                  countryCode={getCountryCode(getUnbrandedLocale(lang))}
                />
                {getUnbrandedLocale(lang)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </If>
    );
  }
}

export default withStorage(HeaderLanguages);
