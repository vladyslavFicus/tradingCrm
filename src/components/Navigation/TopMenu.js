import React from 'react';

const TopMenu = (props) => (
  <nav className="top-menu">
    <div className="menu-icon-container hidden-md-up">
      <div className="animate-menu-button left-menu-toggle">
        <div/>
      </div>
    </div>
    <div className="menu">
      <div className="menu-user-block">
        <div className="dropdown dropdown-avatar">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
            <i className="fa fa-user-secret fa-3x"/>
          </a>
          <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="" role="menu">
            <a className="dropdown-item" href="#">
              <i className="dropdown-icon icmn-user"/>Profile
            </a>
            <a className="dropdown-item" href="#">
              <i className="dropdown-icon icmn-exit"/>Logout
            </a>
          </ul>
        </div>
      </div>
    </div>
  </nav>
);

export default TopMenu;
