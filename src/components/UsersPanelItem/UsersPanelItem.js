import React, { Component } from 'react';
import PropTypes from '../../constants/propTypes';

class UsersPanelItem extends Component {
  static propTypes = {
    fullName: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  };

  render() {
    const {
      fullName,
      login,
      uuid,
      color,
    } = this.props;

    return (
      <button className={`btn-transparent footer-content_tab tab-${color} col-xs-2`}>
        <div className="tab-div">
          <div className="tab-child">
            <div className="player-name">{fullName}</div>
            <div className="player-info">{login} - {uuid}</div>
          </div>

          <i className="fa fa-times-circle" />
        </div>
      </button>
    );
  }
}

export default UsersPanelItem;
