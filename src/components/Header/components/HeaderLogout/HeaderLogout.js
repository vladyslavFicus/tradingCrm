import React, { Component } from 'react';
import history from 'router/history';
import './header-logout.scss';

class HeaderLogout extends Component {
  handleLogoutClick = () => {
    history.replace('/logout');
  }

  render() {
    return (
      <div
        className="header-logout"
        onClick={this.handleLogoutClick}
        title="Log out"
      >
        <i className="fa fa-sign-out" />
      </div>
    );
  }
}

export default HeaderLogout;
