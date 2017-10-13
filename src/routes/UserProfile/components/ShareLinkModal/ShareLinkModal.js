import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getDomain } from '../../../../config';

class ShareLinkModal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    playerUUID: PropTypes.string.isRequired,
    notificationLevel: PropTypes.oneOf(['info', 'warning', 'success']),
    notificationTitle: PropTypes.string,
    notificationMessage: PropTypes.string.isRequired,
  };
  static defaultProps = {
    notificationLevel: 'success',
    notificationTitle: I18n.t('COMMON.NOTIFICATIONS.COPIED'),
    notificationMessage: I18n.t('COMMON.NOTIFICATIONS.COPY_PROFILE_LINK'),
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  animate = () => {
    setTimeout(this.toggle, 1000);
  };

  handleCopy = () => {
    const { addNotification } = this.context;
    const {
      notificationLevel,
      notificationTitle,
      notificationMessage,
    } = this.props;

    this.animate();

    addNotification({
      level: notificationLevel,
      title: notificationTitle,
      message: notificationMessage,
    });
  };

  render() {
    const { onClose, playerUUID } = this.props;

    const inputValue = `${getDomain()}/users/${playerUUID}/profile`;

    return (
      <Modal className="share-profile-modal" toggle={onClose} isOpen>
        <ModalHeader toggle={onClose}>
          {I18n.t('SHARE_LINK_MODAL.TITLE')}
        </ModalHeader>
        <ModalBody>
          <div className="text-center font-weight-700 margin-bottom-20">
            {I18n.t('SHARE_LINK_MODAL.TEXT')}
          </div>
          <div className="row">
            <div className="col-sm-9">
              <input
                type="text"
                value={inputValue}
                className="form-control"
                readOnly
              />
            </div>
            <div className="col-sm-3">
              <CopyToClipboard text={inputValue} onCopy={this.handleCopy}>
                <button className="btn btn-primary-outline share-profile-modal__copy-button">
                  {I18n.t('SHARE_LINK_MODAL.COPY_LINK')}
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-default-outline" onClick={onClose}>
            {I18n.t('COMMON.BUTTONS.CLOSE')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ShareLinkModal;
