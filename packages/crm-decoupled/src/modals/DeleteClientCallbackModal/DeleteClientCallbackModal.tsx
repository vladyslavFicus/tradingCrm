import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { notify, LevelType } from '@crm/common';
import { ClientCallback } from '__generated__/types';
import Modal from 'components/Modal';
import { useDeleteClientCallbackMutation } from './graphql/__generated__/DeleteClientCallbackMutation';

export type Props = {
  callback: ClientCallback,
  onCloseModal: () => void,
  onSuccess?: () => void,
};

const DeleteClientCallbackModal = (props: Props) => {
  const { callback, onCloseModal, onSuccess } = props;
  const { callbackId, client, callbackTime } = callback;

  // ===== Requests ===== //
  const [deleteClientCallbackMutation, { loading }] = useDeleteClientCallbackMutation();

  // ===== Handlers ===== //
  const handleSubmit = async () => {
    try {
      await deleteClientCallbackMutation({ variables: { callbackId } });

      onSuccess?.();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CALLBACKS.DELETE_MODAL.NOTIFICATION.CLIENT_TITLE'),
        message: I18n.t('CALLBACKS.DELETE_MODAL.SUCCESSFULLY_DELETED'),
      });
    } catch (e) {
      onCloseModal();

      notify({
        level: LevelType.ERROR,
        title: I18n.t('CALLBACKS.DELETE_MODAL.NOTIFICATION.CLIENT_TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Modal
      warning
      onCloseModal={onCloseModal}
      title={I18n.t('CALLBACKS.DELETE_MODAL.CLIENT_HEADER')}
      buttonTitle={I18n.t('COMMON.BUTTONS.DELETE')}
      styleButton="danger"
      disabled={loading}
      clickSubmit={handleSubmit}
    >
      {I18n.t('CALLBACKS.DELETE_MODAL.CLIENT_ACTION_TEXT', {
        fullName: client?.fullName || '',
        time: moment.utc(callbackTime).local().format('HH:mm:ss'),
        date: moment.utc(callbackTime).local().format('DD.MM.YYYY'),
      })}
    </Modal>
  );
};

export default React.memo(DeleteClientCallbackModal);
