import React from 'react';

const LeftMenu = (props) => (
  <nav className="left-menu">
    <div className="logo-container">
      <a href="index.html" className="logo">
        <img src="/img/logo.png" alt="Clean UI Admin Template"/>
        <img className="logo-inverse" src="/img/logo-inverse.png" alt="Clean UI Admin Template"/>
      </a>
    </div>
    <div className="left-menu-inner scroll-pane">
      <ul className="left-menu-list left-menu-list-root list-unstyled">
        <li>
          <a className="left-menu-link" href="documentation.html">
            <i className="left-menu-link-icon icmn-books"/>
            Documentation
          </a>
        </li>
      </ul>
    </div>
  </nav>
);

export default LeftMenu;
