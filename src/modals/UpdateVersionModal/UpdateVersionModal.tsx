import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Storage } from 'types/storage';
import { withStorage } from 'providers/StorageProvider';
import { Button } from 'components/Buttons';
import './UpdateVersionModal.scss';

type Props = {
  storage: Storage,
  newVersion: string,
};

const UpdateVersionModal = (props: Props) => {
  const { storage, newVersion } = props;

  const clearCacheData = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });

    storage.set('clientVersion', newVersion);
    window.location.reload();
  };

  return (
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
          onClick={clearCacheData}
        >
          {I18n.t('COMMON.BUTTONS.UPDATE_NOW')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default compose(
  React.memo,
  withStorage(['clientVersion']),
)(UpdateVersionModal);
