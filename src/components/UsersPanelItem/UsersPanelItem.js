import React, { Component } from 'react';
import PropTypes from '../../constants/propTypes';
import './UsersPanelItem.scss';

class UsersPanelItem extends Component {
  static propTypes = {
    fullName: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
  };

  render() {
    const {
      fullName,
      login,
      uuid,
      color,
      onClick,
      onRemoveClick,
    } = this.props;

    return (
      <div className={`btn-transparent users-panel-row_item tab-${color}`} onClick={onClick}>
        <div className="users-panel-row_item-block">
          <div className="users-panel-row_item-block-info">
            <div className="player-name">{fullName}</div>
            <div className="player-info">{login} - {uuid}</div>
          </div>

          <button className="btn-transparent color-black" onClick={onRemoveClick}>
            <i className="fa fa-times-circle" />
          </button>
        </div>
      </div>
    );
  }
}

export default UsersPanelItem;
