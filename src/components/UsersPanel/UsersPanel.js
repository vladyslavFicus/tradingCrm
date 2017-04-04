import React, { Component } from 'react';
import UsersPanelItem from '../UsersPanelItem';
import PropTypes from '../../constants/propTypes';
import './UsersPanel.scss';

class UsersPanel extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.userPanelItem).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    const { items, onClose } = this.props;

    if (!items.length) {
      return null;
    }

    return (
      <footer className="users-panel">
        <div className="users-panel-row">
          {items.map(item => <UsersPanelItem key={item.uuid} {...item} />)}
        </div>

        <button className="users-panel-menu btn-transparent" onClick={onClose}>
          &times;
        </button>
      </footer>
    );
  }
}

export default UsersPanel;
