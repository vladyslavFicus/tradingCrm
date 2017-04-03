import React, { Component } from 'react';
import PropTypes from '../../constants/propTypes';
import './UsersPanelItem.scss';

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
      <button className={`btn-transparent users-panel-row_item tab-${color}`}>
        <div className="users-panel-row_item-block">
          <div className="users-panel-row_item-block-info">
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
