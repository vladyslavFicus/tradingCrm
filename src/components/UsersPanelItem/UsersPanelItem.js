import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import './UsersPanelItem.scss';

class UsersPanelItem extends Component {
  static propTypes = {
    active: PropTypes.bool,
    fullName: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
  };
  static defaultProps = {
    active: false,
  };

  handleRemoveClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    this.props.onRemoveClick();
  };

  render() {
    const {
      active,
      fullName,
      login,
      uuid,
      color,
      onClick,
    } = this.props;
    const blockClassName = classNames('users-panel-footer-row_item cursor-pointer', `tab-${color}`, { view: active });

    return (
      <div className={blockClassName} onClick={onClick}>
        <div className="users-panel-footer-row_item-block">
          <div className="users-panel-footer-row_item-block-info">
            <div className="player-name">{fullName}</div>
            <div className="player-info">{login} - {uuid}</div>
          </div>

          <button className="btn-transparent color-black" onClick={this.handleRemoveClick}>
            <i className="fa fa-times-circle" />
          </button>
        </div>
      </div>
    );
  }
}

export default UsersPanelItem;
