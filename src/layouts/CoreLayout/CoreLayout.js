import React, { PureComponent } from 'react';
import NotificationContainer from 'react-notification-system';
import PropTypes from 'constants/propTypes';
import 'styles/main.scss';

class CoreLayout extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]).isRequired,
  };

  static childContextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  getChildContext() {
    return {
      addNotification: this.handleNotify,
    };
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
      <>
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
      </>
    );
  }
}

export default CoreLayout;
