import React from 'react';
import NotificationCenter from 'components/NotificationCenter';
import HeaderLogout from 'components/Header/layouts/components/HeaderLogout';
import HeaderDepartments from './components/HeaderDepartments';
import HeaderLanguages from './components/HeaderLanguages';
import HeaderCalendar from './components/HeaderCalendar';
import HeaderLogo from './components/HeaderLogo';
import './Header.scss';

const Header = () => (
  <header className="Header">
    <HeaderLogo />

    <div className="Header__body">
      <HeaderDepartments />

      <div className="Header__controls">
        <HeaderLanguages />
        <NotificationCenter />
        <HeaderCalendar />
        <HeaderLogout />
      </div>
    </div>
  </header>
);

export default React.memo(Header);
