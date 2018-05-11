import React, { Component } from 'react';
import { compose } from 'redux';
import classNames from 'classnames';
import UsersPanelItem from '../UsersPanelItem';
import PropTypes from '../../constants/propTypes';
import './UsersPanel.scss';
import { withModals } from '../../components/HighOrder';
import ReplaceTabsModal from './ReplaceTabsModal';

const MAX_ACTIVE_TAB = 5;

class UsersPanel extends Component {
  static propTypes = {
    active: PropTypes.userPanelItem,
    items: PropTypes.arrayOf(PropTypes.userPanelItem).isRequired,
    onItemClick: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onReplace: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      replaceTabsModal: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };
  static defaultProps = {
    active: null,
  };

  componentWillMount() {
    if (this.props.active && this.props.items.length > 0) {
      document.body.classList.add('user-panel-open');
    }
  }

  componentWillReceiveProps({ active: nextActive, items: nextItems }) {
    const {
      modals: { replaceTabsModal },
      items,
      onReplace,
      active,
    } = this.props;

    if (nextActive && !active) {
      document.body.classList.add('user-panel-open');
    }

    if (active && !nextActive) {
      document.body.classList.remove('user-panel-open');
    }

    if (
      (items.length <= MAX_ACTIVE_TAB && nextItems.length > MAX_ACTIVE_TAB) ||
      (!replaceTabsModal.isOpen && items.length > MAX_ACTIVE_TAB)
    ) {
      replaceTabsModal.show({
        onSubmit: this.handleReplace,
        onClose: this.handleCancelReplace,
        onReplace,
        items,
      });
    }

    if (items.length > MAX_ACTIVE_TAB && nextItems.length <= MAX_ACTIVE_TAB) {
      replaceTabsModal.hide();
    }
  }

  handleReplace = (selectedItems) => {
    const { onReplace, modals } = this.props;

    onReplace(selectedItems);
    modals.replaceTabsModal.hide();
  };

  handleCancelReplace = () => {
    const { items, onRemove, modals } = this.props;

    const [newItem] = items.slice(-1);
    onRemove(newItem.uuid);
    modals.replaceTabsModal.hide();
  };

  render() {
    const {
      active,
      items,
      onClose,
      onRemove,
      onItemClick,
    } = this.props;

    const currentItems = items.slice(0, MAX_ACTIVE_TAB);

    if (!currentItems.length) {
      return null;
    }

    const activeIndex = currentItems.indexOf(active);
    const blockClassName = classNames('users-panel', { 'users-panel-opened': !!active });

    const footerActiveClassName = `with-border-${currentItems[activeIndex] && currentItems[activeIndex].color
      ? currentItems[activeIndex].color
      : undefined}`;

    const footerClassName = classNames('users-panel-footer', {
      'with-border': !!active,
      [footerActiveClassName]: !!active,
    });

    return (
      <div className={blockClassName}>
        <div className="users-panel-content" style={{ visibility: active ? 'visible' : 'hidden' }}>
          {currentItems.map((item) => {
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
                  height: active && active.uuid === item.uuid ? 'calc(100% - 80px)' : '0',
                  margin: active && active.uuid === item.uuid ? '0 auto' : '0',
                  borderTop: active && active.uuid === item.uuid ? '' : '0',
                }}
              />
            );
          })}
        </div>
        <div className={footerClassName}>
          {currentItems.map(item => (
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

export default compose(
  withModals({ replaceTabsModal: ReplaceTabsModal }),
)(UsersPanel);
