import React, { Component } from 'react';
import NotificationContainer from 'react-notification-system';
import { connect } from 'react-redux';
import PropTypes from '../../constants/propTypes';
import { actionCreators as windowActionCreators, actionTypes as windowActionTypes } from '../../redux/modules/window';

class CoreLayout extends Component {
  static propTypes = {
    userPanels: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.userPanelItem),
    }).isRequired,
    children: PropTypes.element.isRequired,
  };
  static childContextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  state = { isFrameVersion: window && window.parent !== window && window.parent.postMessage };

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

            if (action.type === windowActionTypes.NOTIFICATION && this.notificationNode.addNotification) {
              this.notificationNode.addNotification(action.payload);
            }
          }
        }
      });
    }
  }

  handleNotify = (params) => {
    const defaultParams = { position: 'bc' };
    const mergedParams = { ...defaultParams, ...params };

    if (this.state.isFrameVersion) {
      window.parent.postMessage(JSON.stringify(windowActionCreators.notify(mergedParams)), window.location.origin);
    } else if (this.notificationNode) {
      this.notificationNode.addNotification(mergedParams);
    }
  };

  render() {
    const { isFrameVersion } = this.state;
    const { children, userPanels } = this.props;

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
                  marginLeft: '0px',
                  marginBottom: userPanels.items.length > 0 ? '50px' : '0px',
                },
              },
            }}
          />
        }
      </div>
    );
  }
}

export default connect(({ userPanels }) => ({ userPanels }))(CoreLayout);
