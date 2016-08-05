import React from 'react';

const TopMenu = (props) => (<nav className="top-menu">
    <div className="menu-icon-container hidden-md-up">
      <div className="animate-menu-button left-menu-toggle">
        <div/>
      </div>
    </div>
    <div className="menu">
      <div className="menu-user-block">
        <div className="dropdown dropdown-avatar">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
            <span className="avatar" href="#">
                <img src="/img/temp/avatars/1.jpg" alt="Alternative text to the image"/>
            </span>
          </a>
          <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="" role="menu">
            <a className="dropdown-item" href="#">
              <i className="dropdown-icon icmn-user"/> Profile
            </a>
            <div className="dropdown-divider"/>
            <div className="dropdown-header">Home</div>
            <a className="dropdown-item" href="#">
              <i className="dropdown-icon icmn-circle-right"/>
              Dashboard
            </a>
            <a className="dropdown-item" href="#">
              <i className="dropdown-icon icmn-circle-right"/> Boards
            </a>
            <a className="dropdown-item" href="#">
              <i className="dropdown-icon icmn-circle-right"/> Issue
              Navigator</a>
            <div className="dropdown-divider"/>
            <a className="dropdown-item" href="#">
              <i className="dropdown-icon icmn-exit"/> Logout
            </a>
          </ul>
        </div>
      </div>
    </div>
  </nav>
);

export default TopMenu;
