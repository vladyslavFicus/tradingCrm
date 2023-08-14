import React from 'react';
import I18n from 'i18n-js';
import { Types, notify } from '@crm/common';
import { File } from '__generated__/types';
import Modal from 'components/Modal';
import { useDeleteFileMutation } from './graphql/__generated__/DeleteFileMutation';
import './DeleteFileModal.scss';

export type Props = {
  file: File,
  onCloseModal: () => void,
  onSuccess?: () => void,
};

const DeleteFileModal = (props: Props) => {
  const { file, onCloseModal, onSuccess } = props;

  const [deleteFileMutation, { loading }] = useDeleteFileMutation();

  const handleDelete = async () => {
    try {
      await deleteFileMutation({ variables: { uuid: file.uuid } });

      onSuccess?.();
      onCloseModal();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.TITLE'),
        message: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.SUCCESS'),
      });
    } catch {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.TITLE'),
        message: I18n.t('FILES.DELETE_MODAL.NOTIFICATIONS.ERROR'),
      });
    }
  };

  return (
    <Modal
      warning
      onCloseModal={onCloseModal}
      title={I18n.t('FILES.DELETE_MODAL.TITLE')}
      styleButton="danger"
      disabled={loading}
      clickSubmit={handleDelete}
      buttonTitle={I18n.t('FILES.DELETE_MODAL.BUTTONS.DELETE')}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: I18n.t('FILES.DELETE_MODAL.ACTION_TEXT', {
            fileName: file.fileName,
          }),
        }}
      />
      <div className="DeleteFileModal__warning"> {I18n.t('FILES.DELETE_MODAL.WARNING_TEXT')} </div>
    </Modal>
  );
};

export default React.memo(DeleteFileModal);
