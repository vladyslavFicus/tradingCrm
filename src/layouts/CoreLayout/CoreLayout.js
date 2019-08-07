import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { I18n } from 'react-redux-i18n';
import NotificationContainer from 'react-notification-system';
import PropTypes from 'constants/propTypes';
import { types as modalsTypes } from 'constants/modals';
import { actionCreators as windowActionCreators, actionTypes as windowActionTypes } from 'redux/modules/window';
import { actionCreators as notificationCreators } from 'redux/modules/notifications';
import MiniProfilePopover from 'components/MiniProfilePopover';
import DebugPanel from 'components/DebugPanel';
import UpdateVersionModal from 'components/UpdateVersionModal';
import { withModals } from 'components/HighOrder';
import parseJson from 'utils/parseJson';
import 'styles/style.scss';

const popoverInitialState = {
  name: null,
  params: {},
};
const MINI_PROFILE_POPOVER = 'mini-profile-popover';

class CoreLayout extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
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
      updateVersionModal: PropTypes.modalType,
    }).isRequired,
  };

  static childContextTypes = {
    addNotification: PropTypes.func.isRequired,
    miniProfile: PropTypes.shape({
      onShowMiniProfile: PropTypes.func.isRequired,
      onHideMiniProfile: PropTypes.func.isRequired,
    }),
  };

  static defaultProps = {
    notifications: [],
  };

  state = {
    isFrameVersion: window.isFrame,
    miniProfilePopover: { ...popoverInitialState },
  };

  getChildContext() {
    return {
      addNotification: this.handleNotify,
      miniProfile: {
        onShowMiniProfile: this.handleShowMiniProfile,
        onHideMiniProfile: this.handleHideMiniProfile,
      },
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
      modals: { updateVersionModal },
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
      nextModalName === modalsTypes.NEW_API_VERSION
      && !updateVersionModal.isOpen
    ) {
      updateVersionModal.show();
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

  handleHideMiniProfile = (callback) => {
    this.setState({ miniProfilePopover: { ...popoverInitialState } }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  handleShowMiniProfile = (target, params, type, popoverMouseEvents, placement) => {
    this.setState({
      miniProfilePopover: {
        name: MINI_PROFILE_POPOVER,
        params: {
          data: params,
          target,
          type,
          popoverMouseEvents,
          placement,
        },
      },
    });
  };

  render() {
    const { isFrameVersion, miniProfilePopover } = this.state;
    const { children } = this.props;

    return (
      <Fragment>
        {children}

        <If condition={window.showDebugPanel}>
          <DebugPanel />
        </If>

        <If condition={!isFrameVersion}>
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
        </If>

        <If condition={miniProfilePopover.name === MINI_PROFILE_POPOVER}>
          <MiniProfilePopover
            {...miniProfilePopover.params}
          />
        </If>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ modal, notifications }) => ({
  modal,
  notifications,
});

const mapActions = {
  removeNotification: notificationCreators.remove,
};

export default compose(
  withModals({
    updateVersionModal: UpdateVersionModal,
  }),
  connect(mapStateToProps, mapActions),
)(CoreLayout);
