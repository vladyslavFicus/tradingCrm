import React, { PureComponent } from 'react';
import I18n from 'i18n';
import HeaderDepartments from './components/HeaderDepartments';
import HeaderLanguages from './components/HeaderLanguages';
import HeaderCalendar from './components/HeaderCalendar';
import HeaderLogout from './components/HeaderLogout';
import HeaderLogo from './components/HeaderLogo';
import './Header.scss';

class Header extends PureComponent {
  render() {
    return (
      <header className="Header">
        <HeaderLogo />

        <div className="Header__body">
          <HeaderDepartments />

          <div className="Header__controls">
            <If condition={Object.keys(I18n.translations).length > 1}>
              <HeaderLanguages />
            </If>

            <HeaderCalendar />
            <HeaderLogout />
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
