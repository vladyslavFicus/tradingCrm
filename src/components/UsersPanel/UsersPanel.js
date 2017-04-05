import React, { Component } from 'react';
import UsersPanelItem from '../UsersPanelItem';
import PropTypes from '../../constants/propTypes';
import './UsersPanel.scss';

class UsersPanel extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.userPanelItem).isRequired,
    onItemClick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  render() {
    const { items, onClose, onRemove, onItemClick } = this.props;

    if (!items.length) {
      return null;
    }

    return (
      <footer className="users-panel border">
        <div className="users-panel-row">
          {items.map((item, index) => (
            <UsersPanelItem
              key={item.uuid}
              {...item}
              onClick={() => onItemClick(index)}
              onRemoveClick={() => onRemove(index)}
            />
          ))}
        </div>

        <button className="users-panel-menu btn-transparent" onClick={onClose}>
          &times;
        </button>
      </footer>
    );
  }
}

export default UsersPanel;
