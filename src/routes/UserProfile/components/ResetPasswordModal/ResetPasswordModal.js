import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { shortify } from '../../../../utils/uuid';

const ResetPasswordModal = (props) => {
  const { onClose, playerName, playerUUID, resetPassword } = props;

  return (
    <Modal className="modal-danger" toggle={onClose} isOpen>
      <ModalHeader toggle={onClose}>
        {I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TITLE')}
      </ModalHeader>
      <ModalBody>
        <div className="text-center font-weight-700 margin-bottom-20">
          {I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.TEXT')}
          <br />
          {playerName} - <span className="font-weight-400">{shortify(playerUUID)}</span>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-default-outline" onClick={onClose}>
          {I18n.t('COMMON.CLOSE')}
        </button>
        <button className="btn btn-danger" onClick={resetPassword}>
          {I18n.t('PLAYER_PROFILE.PROFILE.RESET_PASSWORD_MODAL.BUTTON_ACTION')}
        </button>
      </ModalFooter>
    </Modal>
  );
};

ResetPasswordModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  playerName: PropTypes.string.isRequired,
  playerUUID: PropTypes.string.isRequired,
  resetPassword: PropTypes.func.isRequired,
};

export default ResetPasswordModal;
