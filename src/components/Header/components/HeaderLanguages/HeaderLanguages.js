import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import Flag from 'react-world-flags';
import I18n from 'i18n';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { getCountryCode } from 'utils/countryList';
import './header-lang.scss';

class HeaderLanguages extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    storage: PropTypes.storage.isRequired,
  }

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
    storage.set({ locale: value });
  }

  render() {
    const { locale } = this.props;
    const { isOpen } = this.state;

    const languages = Object.keys(I18n.translations).filter(lang => lang !== locale);

    return (
      <Dropdown
        className={
          classNames(
            'header-lang',
            { 'is-open': isOpen },
          )}
        isOpen={isOpen}
        toggle={this.handleToggleIsOpenState}
      >
        <DropdownToggle className="header-lang__toggle" tag="div">
          <Flag className="header-lang__flag" code={getCountryCode(locale)} />
          {locale}
          <i className="header-lang__caret fa fa-angle-down" />
        </DropdownToggle>
        <DropdownMenu className="header-lang__list">
          {languages.map(lang => (
            <DropdownItem
              key={lang}
              className="header-lang__item"
              onClick={this.selectLanguage}
              value={lang}
            >
              <Flag className="header-lang__flag" code={getCountryCode(lang)} />
              {lang}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default withStorage(['locale'])(HeaderLanguages);
