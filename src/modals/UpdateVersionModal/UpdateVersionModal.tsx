import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button } from 'components/Buttons';
import './UpdateVersionModal.scss';

const UpdateVersionModal = () => (
  <Modal className="UpdateVersionModal" isOpen>
    <ModalHeader className="UpdateVersionModal__header">
      {I18n.t('COMMON.UPDATE_VERSION_MODAL.TITLE')}
    </ModalHeader>

    <ModalBody>
      <div className="UpdateVersionModal__content">
        {I18n.t('COMMON.UPDATE_VERSION_MODAL.TEXT')}
      </div>
    </ModalBody>

    <ModalFooter>
      <Button
        type="submit"
        danger
        onClick={() => window.location.reload()}
      >
        {I18n.t('COMMON.BUTTONS.UPDATE_NOW')}
      </Button>
    </ModalFooter>
  </Modal>
);

export default React.memo(UpdateVersionModal);
