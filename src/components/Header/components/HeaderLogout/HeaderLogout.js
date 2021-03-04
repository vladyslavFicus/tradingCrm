import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import './HeaderLogout.scss';

class HeaderLogout extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
  };

  handleLogoutClick = () => {
    this.props.history.replace('/logout');
  };

  render() {
    return (
      <div
        className="HeaderLogout"
        onClick={this.handleLogoutClick}
        title="Log out"
      >
        <i className="fa fa-sign-out" />
      </div>
    );
  }
}

export default withRouter(HeaderLogout);
