import React, { Component } from 'react';
import I18n from 'i18n';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import Logo from 'components/Logo';
import HeaderDepartments from '../HeaderDepartments';
import HeaderLogout from '../HeaderLogout';
import HeaderLanguages from '../HeaderLanguages';
import HeaderCallbacksCalendarDropdown from '../HeaderCallbacksCalendarDropdown';
import './header.scss';

class Header extends Component {
  static propTypes = {
    brands: PropTypes.arrayOf(
      PropTypes.brand.isRequired,
    ).isRequired,
  };

  render() {
    const { brands } = this.props;

    return (
      <header className="header">
        <Logo
          className="header__logo"
          to={brands.length > 1 ? '/brands' : '/'}
        />
        <div className="header__body">
          <HeaderDepartments />

          <div className="header__controls">
            <If condition={Object.keys(I18n.translations).length > 1}>
              <HeaderLanguages />
            </If>
            <HeaderCallbacksCalendarDropdown />
            <HeaderLogout />
          </div>
        </div>
      </header>
    );
  }
}

export default withStorage(['brands', 'departments'])(Header);
