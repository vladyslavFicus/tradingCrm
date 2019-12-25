import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import './header-logout.scss';

class HeaderLogout extends Component {
  static propTypes = {
    ...PropTypes.router,
  };

  handleLogoutClick = () => {
    this.props.history.replace('/logout');
  };

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

export default withRouter(HeaderLogout);
