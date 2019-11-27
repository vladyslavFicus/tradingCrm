import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CopyToClipboard from '../../../../../../components/CopyToClipboard';
import { getDomain } from '../../../../../../config';

class ShareLinkModal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    playerUUID: PropTypes.string.isRequired,
    notificationLevel: PropTypes.oneOf(['info', 'warning', 'success']),
    notificationTitle: PropTypes.string,
    notificationMessage: PropTypes.string,
  };

  static defaultProps = {
    notificationLevel: 'success',
    notificationTitle: 'COMMON.NOTIFICATIONS.COPIED',
    notificationMessage: 'COMMON.NOTIFICATIONS.COPY_PROFILE_LINK',
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  render() {
    const {
      onClose,
      playerUUID,
      notificationLevel,
      notificationTitle,
      notificationMessage,
    } = this.props;

    const inputValue = `${getDomain()}/clients/${playerUUID}/profile`;

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
              <CopyToClipboard
                notify
                text={inputValue}
                notificationLevel={notificationLevel}
                notificationTitle={notificationTitle}
                notificationMessage={notificationMessage}
              >
                <button type="button" className="btn btn-primary-outline share-profile-modal__copy-button">
                  {I18n.t('SHARE_LINK_MODAL.COPY_LINK')}
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-default-outline"
            onClick={onClose}
          >
            {I18n.t('COMMON.CLOSE')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ShareLinkModal;
