import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { I18n } from 'react-redux-i18n';
import NotificationContainer from 'react-notification-system';
import PropTypes from '../../constants/propTypes';
import { actionCreators as windowActionCreators, actionTypes as windowActionTypes } from '../../redux/modules/window';
import { actionCreators as notificationCreators } from '../../redux/modules/notifications';
import DebugPanel from '../../components/DebugPanel';
import { types as modalsTypes } from '../../constants/modals';
import ConfirmActionModal from '../../components/Modal/ConfirmActionModal';
import { actionCreators as modalActionCreators } from '../../redux/modules/modal';
import { withModals } from '../../components/HighOrder';
import parseJson from '../../utils/parseJson';
import '../../styles/style.scss';

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
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
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
            const action = parseJson(data, null);

            if (
              action
              && action.type === windowActionTypes.NOTIFICATION && this.notificationNode
              && this.notificationNode.addNotification
            ) {
              this.notificationNode.addNotification(action.payload);
            }
          }
        }
      });
    }
  }

  componentWillReceiveProps({ notifications: nextNotifications, modal: { name: nextModalName } }) {
    const {
      notifications: currentNotifications,
      modals: { confirmActionModal },
      closeModal,
    } = this.props;
    const haveNewNotifications = nextNotifications
      .some(({ id }) => currentNotifications.findIndex(notification => notification.id === id) === -1);

    if (haveNewNotifications) {
      nextNotifications.forEach(({ message, title, ...notification }) => {
        this.handleNotify({ message: I18n.t(message), title: I18n.t(title), ...notification });
        this.props.removeNotification(notification.id);
      });
    }

    if (
      nextModalName === modalsTypes.NEW_API_VERSION &&
      !confirmActionModal.isOpen
    ) {
      confirmActionModal.show({
        onSubmit: this.handleReloadPage,
        onCloseCallback: closeModal,
        modalTitle: I18n.t('MODALS.NEW_API_VERSION.TITLE'),
        actionText: I18n.t('MODALS.NEW_API_VERSION.MESSAGE'),
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

  handleReloadPage = () => location.reload(true);

  render() {
    const { isFrameVersion } = this.state;
    const { children } = this.props;

    return (
      <Fragment>
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
      </Fragment>
    );
  }
}

const mapStateToProps = ({ modal, notifications }) => ({
  modal,
  notifications,
});
const mapActions = {
  closeModal: modalActionCreators.close,
  removeNotification: notificationCreators.remove,
};

export default compose(
  withModals({
    confirmActionModal: ConfirmActionModal,
  }),
  connect(mapStateToProps, mapActions),
)(CoreLayout);
