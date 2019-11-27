import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import PropTypes from '../../constants/propTypes';

const UpdateVersionModal = ({ isOpen }) => (
  <Modal isOpen={isOpen} className="modal-danger">
    <ModalHeader>{I18n.t('COMMON.UPDATE_VERSION_MODAL.TITLE')}</ModalHeader>
    <ModalBody>
      <div className="text-center font-weight-700">
        <div>{I18n.t('COMMON.UPDATE_VERSION_MODAL.TEXT')}</div>
      </div>
    </ModalBody>

    <ModalFooter className="">
      <button
        type="submit"
        className="btn btn-danger-outline"
        onClick={() => window.location.reload(true)}
      >
        {I18n.t('COMMON.BUTTONS.UPDATE_NOW')}
      </button>
    </ModalFooter>
  </Modal>
);

UpdateVersionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default UpdateVersionModal;
