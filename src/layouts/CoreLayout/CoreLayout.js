import React, { Component } from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import NotificationContainer from 'react-notification-system';
import PropTypes from '../../constants/propTypes';
import { actionCreators as windowActionCreators, actionTypes as windowActionTypes } from '../../redux/modules/window';
import { actionCreators as notificationCreators } from '../../redux/modules/notifications';
import DebugPanel from '../../components/DebugPanel';
import { types as modalsTypes } from '../../constants/modals';
import ConfirmActionModal from '../../components/Modal/ConfirmActionModal';
import { actionCreators as modalActionCreators } from '../../redux/modules/modal';

class CoreLayout extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    closeModal: PropTypes.func.isRequired,
    modal: PropTypes.shape({
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      params: PropTypes.object,
    }).isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      message: PropTypes.string,
      level: PropTypes.string,
    })),
    removeNotification: PropTypes.func.isRequired,
  };

  static defaultProps = {
    notifications: [],
  };

  static childContextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  state = { isFrameVersion: window.isFrame };

  getChildContext() {
    return {
      addNotification: this.handleNotify,
    };
  }

  componentDidMount() {
    if (!this.state.isFrameVersion) {
      window.addEventListener('message', ({ data, origin }) => {
        if (origin === window.location.origin) {
          if (typeof data === 'string') {
            const action = JSON.parse(data);

            if (
              action.type === windowActionTypes.NOTIFICATION && this.notificationNode
              && this.notificationNode.addNotification
            ) {
              this.notificationNode.addNotification(action.payload);
            }
          }
        }
      });
    }
  }

  componentWillReceiveProps({ notifications: nextNotifications }) {
    const { notifications: currentNotifications } = this.props;
    const haveNewNotifications = nextNotifications
      .some(({ id }) => currentNotifications.findIndex(notification => notification.id === id) === -1);

    if (haveNewNotifications) {
      nextNotifications.forEach(({ message, title, ...notification }) => {
        this.handleNotify({ message: I18n.t(message), title: I18n.t(title), ...notification });
        this.props.removeNotification(notification.id);
      });
    }
  }
  handleNotify = (params) => {
    const defaultParams = { position: 'br' };
    const mergedParams = { ...defaultParams, ...params };

    if (this.state.isFrameVersion) {
      window.dispatchAction(windowActionCreators.notify(mergedParams));
    } else if (this.notificationNode) {
      this.notificationNode.addNotification(mergedParams);
    }
  };

  handleReloadPage = () => location.reload();

  render() {
    const { isFrameVersion } = this.state;
    const { children, modal, closeModal } = this.props;

    return (
      <div style={{ height: '100%' }}>
        {children}

        {window.showDebugPanel && <DebugPanel />}
        {
          !isFrameVersion &&
          <NotificationContainer
            ref={(node) => {
              this.notificationNode = node;
            }}
            style={{
              Containers: {
                DefaultStyle: { zIndex: 9999 },
                bc: {
                  left: 'auto',
                  right: '0px',
                },
              },
            }}
          />
        }
        {
          modal && modal.name === modalsTypes.NEW_API_VERSION &&
          <ConfirmActionModal
            onSubmit={this.handleReloadPage}
            onClose={closeModal}
            modalTitle={I18n.t('MODALS.NEW_API_VERSION.TITLE')}
            actionText={I18n.t('MODALS.NEW_API_VERSION.MESSAGE')}
          />
        }
      </div>
    );
  }
}

export default connect(({ modal, notifications }) => ({
  modal,
  notifications,
}), {
  closeModal: modalActionCreators.close,
  removeNotification: notificationCreators.remove,
})(CoreLayout);
