import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import { shortify } from '../../utils/uuid';
import './UsersPanelItem.scss';

class UsersPanelItem extends Component {
  static propTypes = {
    active: PropTypes.bool,
    fullName: PropTypes.string,
    uuid: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    login: PropTypes.string.isRequired,
  };

  static defaultProps = {
    active: false,
    fullName: '',
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
    const blockClassName = classNames('users-panel-footer__tab', `tab-${color}`, { view: active });

    return (
      <div className={blockClassName} onClick={onClick}>
        <div className="users-panel-footer__tab__block">
          <div className="users-panel-footer__tab__name">{fullName}</div>
          <div className="users-panel-footer__tab__info">
            {!!login && `${login} - `}{shortify(uuid, uuid.indexOf('PLAYER') === -1 ? 'PL' : '')}
          </div>
          <button
            type="button"
            className="btn-transparent users-panel-footer__tab__close"
            onClick={this.handleRemoveClick}
          >
            <i className="fa fa-times-circle" />
          </button>
        </div>
      </div>
    );
  }
}

export default UsersPanelItem;
