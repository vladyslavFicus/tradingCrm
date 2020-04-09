import React, { Component, Fragment } from 'react';
import I18n from 'i18n-js';
import NotificationContainer from 'react-notification-system';
import PropTypes from 'constants/propTypes';
import parseJson from 'utils/parseJson';
import 'styles/main.scss';

class CoreLayout extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      message: PropTypes.string,
      level: PropTypes.string,
    })),
  };

  static childContextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  static defaultProps = {
    notifications: [],
  };

  getChildContext() {
    return {
      addNotification: this.handleNotify,
    };
  }

  componentDidMount() {
    window.addEventListener('message', ({ data, origin }) => {
      if (origin === window.location.origin) {
        if (typeof data === 'string') {
          const action = parseJson(data, null);

          if (
            action
            && this.notificationNode
            && this.notificationNode.addNotification
          ) {
            this.notificationNode.addNotification(action.payload);
          }
        }
      }
    });
  }

  componentWillReceiveProps({ notifications: nextNotifications }) {
    const {
      notifications: currentNotifications,
    } = this.props;
    const haveNewNotifications = nextNotifications
      .some(({ id }) => currentNotifications.findIndex(notification => notification.id === id) === -1);

    if (haveNewNotifications) {
      nextNotifications.forEach(({ message, title, ...notification }) => {
        this.handleNotify({ message: I18n.t(message), title: I18n.t(title), ...notification });
      });
    }
  }

  handleNotify = (params) => {
    const defaultParams = { position: 'br' };
    const mergedParams = { ...defaultParams, ...params };

    if (this.notificationNode) {
      this.notificationNode.addNotification(mergedParams);
    }
  };

  render() {
    const { children } = this.props;

    return (
      <Fragment>
        {children}

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
      </Fragment>
    );
  }
}

export default CoreLayout;
