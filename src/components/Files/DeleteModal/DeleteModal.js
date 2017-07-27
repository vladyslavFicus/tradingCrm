import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../constants/propTypes';
import { shortify } from '../../../utils/uuid';

const DeleteModal = ({ playerProfile, file, onSuccess, onClose }) => (
  <Modal className="delete-modal" toggle={onClose} isOpen>
    <ModalHeader toggle={onClose}>
      {I18n.t('FILES.DELETE_MODAL.TITLE')}
    </ModalHeader>
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

DeleteModal.propTypes = {
  playerProfile: PropTypes.object.isRequired,
  file: PropTypes.fileEntity.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteModal;
