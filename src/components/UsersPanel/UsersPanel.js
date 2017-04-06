import React, { Component } from 'react';
import classNames from 'classnames';
import UsersPanelItem from '../UsersPanelItem';
import PropTypes from '../../constants/propTypes';
import './UsersPanel.scss';

class UsersPanel extends Component {
  static propTypes = {
    active: PropTypes.userPanelItem,
    items: PropTypes.arrayOf(PropTypes.userPanelItem).isRequired,
    onItemClick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string),
  };
  static defaultProps = {
    colors: ['orange', 'green', 'purple', 'blue', 'pink'],
  };

  componentWillMount() {
    if (this.props.active && this.props.items.length > 0) {
      document.body.classList.add('user-panel-open');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.active && this.props.active) {
      document.body.classList.add('user-panel-open');
    }

    if (this.props.active && !nextProps.active) {
      document.body.classList.remove('user-panel-open');
    }
  }

  render() {
    const { active, items, onClose, onRemove, onItemClick, colors } = this.props;

    if (!items.length) {
      return null;
    }

    const activeIndex = items.indexOf(active);
    const blockClassName = classNames('users-panel', { 'users-panel-opened': !!active });
    const footerClassName = classNames('users-panel-footer', {
      border: !!active,
    }, `border-${colors[activeIndex]}`);

    return (
      <div className={blockClassName}>
        <div className="users-panel-content" style={{ display: active ? 'block' : 'none' }}>
          {items.map(item => (
            <iframe
              frameBorder={0}
              src={`/users/${item.uuid}/profile`}
              key={item.uuid}
              style={{ display: active && active.uuid === item.uuid ? 'block' : 'none', width: '100%', height: '100%' }}
            />
          ))}
        </div>
        <footer className={footerClassName}>
          <div className="users-panel-footer-row">
            {items.map((item, index) => (
              <UsersPanelItem
                active={active && active.uuid === item.uuid}
                key={item.uuid}
                {...item}
                color={colors[index]}
                onClick={() => onItemClick(index)}
                onRemoveClick={() => onRemove(index)}
              />
            ))}
          </div>

          <button className="users-panel-footer-menu btn-transparent" onClick={onClose}>
            &times;
          </button>
        </footer>
      </div>
    );
  }
}

export default UsersPanel;
