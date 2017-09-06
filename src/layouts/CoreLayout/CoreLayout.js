import React, { Component } from 'react';
import NotificationContainer from 'react-notification-system';
import PropTypes from '../../constants/propTypes';
import { actionCreators as windowActionCreators, actionTypes as windowActionTypes } from '../../redux/modules/window';
import DebugPanel from '../../components/DebugPanel';

class CoreLayout extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
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

  handleNotify = (params) => {
    const defaultParams = { position: 'br' };
    const mergedParams = { ...defaultParams, ...params };

    if (this.state.isFrameVersion) {
      window.dispatchAction(windowActionCreators.notify(mergedParams));
    } else if (this.notificationNode) {
      this.notificationNode.addNotification(mergedParams);
    }
  };

  render() {
    const { isFrameVersion } = this.state;
    const { children } = this.props;

    return (
      <div style={{ height: '100%' }}>
        {children}

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
      </div>
    );
  }
}

export default CoreLayout;
