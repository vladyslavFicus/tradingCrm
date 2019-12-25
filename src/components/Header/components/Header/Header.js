import React, { Component } from 'react';
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
    departments: PropTypes.arrayOf(
      PropTypes.department.isRequired,
    ).isRequired,
    brands: PropTypes.arrayOf(
      PropTypes.brand.isRequired,
    ).isRequired,
  };

  render() {
    const { departments, brands } = this.props;

    return (
      <header className="header">
        <Logo
          className="header__logo"
          to={brands.length > 1 ? '/brands' : '/'}
        />
        <div className="header__body">
          <If condition={departments.length > 1}>
            <HeaderDepartments />
          </If>

          <div className="header__controls">
            <HeaderLanguages />
            <HeaderCallbacksCalendarDropdown />
            <HeaderLogout />
          </div>
        </div>
      </header>
    );
  }
}

export default withStorage(['brands', 'departments'])(Header);
