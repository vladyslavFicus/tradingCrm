import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { File } from '__generated__/types';
import { LevelType, notify } from 'providers/NotificationProvider';
import EventEmitter, { FILE_REMOVED } from 'utils/EventEmitter';
import { Button } from 'components/Buttons';
import { useDeleteFileMutation } from './graphql/__generated__/DeleteFileMutation';
import './DeleteFileModal.scss';

type Props = {
  file: File,
  onCloseModal: () => void,
}

const DeleteFileModal = (props: Props) => {
  const { file, onCloseModal } = props;

  const [deleteFileMutation, { loading }] = useDeleteFileMutation();

  const handleDelete = async () => {
    try {
      await deleteFileMutation({ variables: { uuid: file.uuid } });

      EventEmitter.emit(FILE_REMOVED, file);

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.TITLE'),
        message: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.SUCCESS'),
      });

      onCloseModal();
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.TITLE'),
        message: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.ERROR'),
      });
    }
  };

  return (
    <Modal className="DeleteFileModal" toggle={onCloseModal} isOpen>
      <ModalHeader toggle={onCloseModal} className="DeleteFileModal__header">
        {I18n.t('FILES.DELETE_MODAL.TITLE')}
      </ModalHeader>

      <ModalBody>
        <div
          dangerouslySetInnerHTML={{
            __html: I18n.t('FILES.DELETE_MODAL.ACTION_TEXT', {
              fileName: file.fileName,
            }),
          }}
        />
        <div className="DeleteFileModal__warning"> {I18n.t('FILES.DELETE_MODAL.WARNING_TEXT')} </div>
      </ModalBody>

      <ModalFooter>
        <Button
          tertiary
          onClick={onCloseModal}
        >
          {I18n.t('COMMON.BUTTONS.CANCEL')}
        </Button>

        <Button
          danger
          disabled={loading}
          onClick={handleDelete}
        >
          {I18n.t('FILES.DELETE_MODAL.BUTTONS.DELETE')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default React.memo(DeleteFileModal);
