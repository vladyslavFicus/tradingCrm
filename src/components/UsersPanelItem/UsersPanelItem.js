import React, { Component } from 'react';
import PropTypes from '../../constants/propTypes';

class UsersPanelItem extends Component {
  static propTypes = {
    fullName: PropTypes.string,
    login: PropTypes.string,
    uiid: PropTypes.string,
    color: PropTypes.string,
  };

  render() {
    const {
      fullName,
      login,
      uiid,
      color,
    } = this.props;

    return (
      <div className="footer-content_tab tab-1 col-xs-2">
        <div className="tab-div">
          <a href="#" className="tab-child">
            <div className="player-name">{fullName}</div>
            <div className="player-info">{login} - {uiid}</div>
          </a>
          <i className="fa fa-times-circle" />
        </div>
      </div>
    );
  }
}

export default UsersPanelItem;
