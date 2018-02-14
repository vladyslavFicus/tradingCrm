import React, { Component } from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import NotificationContainer from 'react-notification-system';
import PropTypes from '../../constants/propTypes';
import { actionCreators as windowActionCreators, actionTypes as windowActionTypes } from '../../redux/modules/window';
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

export default connect(state => ({
  modal: state.modal,
}), {
  closeModal: modalActionCreators.close,
})(CoreLayout);
