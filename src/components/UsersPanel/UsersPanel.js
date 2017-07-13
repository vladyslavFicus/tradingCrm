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

    const activeIndex = items.indexOf(active);
    const blockClassName = classNames('users-panel', { 'users-panel-opened': !!active });
    const footerClassName = classNames('users-panel-footer', {
      border: !!active,
      [`border-${items[activeIndex] && items[activeIndex].color ? items[activeIndex].color : undefined}`]: !!active,
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
                className={className}
                frameBorder={0}
                src={`/users/${item.uuid}/profile`}
                key={item.uuid}
                style={{
                  height: active && active.uuid === item.uuid ? 'calc(100% - 74px)' : '0',
                  margin: active && active.uuid === item.uuid ? '0 auto' : '0',
                  borderTop: active && active.uuid === item.uuid ? '' : '0',
                }}
              />
            );
          })}
        </div>
        <footer className={footerClassName}>
          {items.map((item, index) => (
            <UsersPanelItem
              active={active && active.uuid === item.uuid}
              key={item.uuid}
              {...item}
              onClick={() => onItemClick(index)}
              onRemoveClick={() => onRemove(index)}
            />
          ))}

          <button className="btn-transparent users-panel-footer__close" onClick={onClose}>
            &times;
          </button>
        </footer>
      </div>
    );
  }
}

export default UsersPanel;
