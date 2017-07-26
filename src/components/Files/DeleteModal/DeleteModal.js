import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../constants/propTypes';
import { shortify } from '../../../utils/uuid';

class DeleteModal extends Component {
  static propTypes = {
    file: PropTypes.fileEntity.isRequired,
    playerProfile: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    const {
      playerProfile,
      file,
      onSuccess,
      onClose,
      ...rest
    } = this.props;

    return (
      <Modal {...rest} className="delete-modal" toggle={onClose}>
        <ModalHeader toggle={onClose}> {I18n.t('FILES.DELETE_MODAL.TITLE')} </ModalHeader>
        <ModalBody className="text-center">
          <div
            className="margin-bottom-20 font-weight-700"
            dangerouslySetInnerHTML={{
              __html: I18n.t('FILES.DELETE_MODAL.ACTION_TEXT', {
                fileName: file.name,
                fullName: playerProfile.fullName,
                shortUUID: `<span class="font-weight-100">${shortify(playerProfile.playerUUID)}</span>`,
              }),
            }}
          />
          <div className="margin-bottom-20"> {I18n.t('FILES.DELETE_MODAL.WARNING_TEXT')} </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-default-outline pull-left" onClick={onClose}>
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button className="btn btn-danger" onClick={onSuccess}>
            {I18n.t('FILES.DELETE_MODAL.BUTTONS.DELETE')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default DeleteModal;
