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
  };
  static defaultProps = {
    active: null,
  };

  componentWillMount() {
    if (this.props.active && this.props.items.length > 0) {
      document.body.classList.add('user-panel-open');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active && !this.props.active) {
      document.body.classList.add('user-panel-open');
    }

    if (this.props.active && !nextProps.active) {
      document.body.classList.remove('user-panel-open');
    }
  }

  render() {
    const { active, items, onClose, onRemove, onItemClick } = this.props;

    if (!items.length) {
      return null;
    }

    const blockClassName = classNames('users-panel', { 'users-panel-opened': !!active });
    const footerClassName = classNames('users-panel-footer', {
      'with-border': !!active,
      [`with-border-${active && active.color ? active.color : undefined}`]: !!active,
    });

    return (
      <div className={blockClassName}>
        <div className="users-panel-content" style={{ visibility: active ? 'visible' : 'hidden' }}>
          {items.map((item) => {
            const className = classNames(
              'user-panel-content-frame',
              active && active.color ? `user-panel-content-frame-${active.color}` : ''
            );

            return (
              <iframe
                id={item.uuid}
                key={item.uuid}
                title={item.uuid}
                className={className}
                frameBorder={0}
                src={`/users/${item.uuid}/${item.path || 'profile'}`}
                style={{
                  height: active && active.uuid === item.uuid ? 'calc(100% - 74px)' : '0',
                  margin: active && active.uuid === item.uuid ? '0 auto' : '0',
                  borderTop: active && active.uuid === item.uuid ? '' : '0',
                }}
              />
            );
          })}
        </div>
        <div className={footerClassName}>
          {items.map(item => (
            <UsersPanelItem
              active={active && active.uuid === item.uuid}
              key={item.uuid}
              {...item}
              onClick={() => onItemClick(active && active.uuid === item.uuid ? null : item.uuid)}
              onRemoveClick={() => onRemove(item.uuid)}
            />
          ))}

          <button className="btn-transparent users-panel-footer__close" onClick={onClose}>
            &times;
          </button>
        </div>
      </div>
    );
  }
}

export default UsersPanel;
