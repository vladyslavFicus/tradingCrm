import React, { Component } from 'react';
import classNames from 'classnames';
import UsersPanelItem from '../UsersPanelItem';
import PropTypes from '../../constants/propTypes';
import './UsersPanel.scss';
import ToMuchOpenedProfilesModal from './ToMuchOpenedProfilesModal';

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

  handleCancelClick = () => this.props.onRemove(this.props.items.length - 1);

  render() {
    const { active, items, onClose, onRemove, onItemClick } = this.props;
    const availableItems = items.slice(0, 5);
    const [newPlayer] = items.slice(-1);

    if (!availableItems.length) {
      return null;
    }

    const activeIndex = availableItems.indexOf(active);
    const blockClassName = classNames('users-panel', { 'users-panel-opened': !!active });
    const footerActiveClassName = `border-${availableItems[activeIndex] && availableItems[activeIndex].color
      ? availableItems[activeIndex].color
      : undefined}`;
    const footerClassName = classNames('users-panel-footer', {
      border: !!active,
      [footerActiveClassName]: !!active,
    });

    return (
      <div className={blockClassName}>
        <div className="users-panel-content" style={{ visibility: active ? 'visible' : 'hidden' }}>
          {availableItems.map((item) => {
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
          {availableItems.map((item, index) => (
            <UsersPanelItem
              active={active && active.uuid === item.uuid}
              key={item.uuid}
              {...item}
              onClick={() => onItemClick(active && active.uuid === item.uuid ? null : index)}
              onRemoveClick={() => onRemove(index)}
            />
          ))}

          <button className="btn-transparent users-panel-footer__close" onClick={onClose}>
            &times;
          </button>
        </div>
        {
          items.length > 5 &&
          <ToMuchOpenedProfilesModal
            isOpen
            items={availableItems}
            newPlayer={newPlayer}
            onClose={this.handleCancelClick}
            onRemove={onRemove}
          />
        }
      </div>
    );
  }
}

export default UsersPanel;
