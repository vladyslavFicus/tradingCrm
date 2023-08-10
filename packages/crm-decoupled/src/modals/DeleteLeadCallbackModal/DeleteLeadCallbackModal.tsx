import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { notify, LevelType } from '@crm/common';
import { LeadCallback } from '__generated__/types';
import Modal from 'components/Modal';
import { useDeleteLeadCallbackMutation } from './graphql/__generated__/DeleteLeadCallbackMutation';

export type Props = {
  callback: LeadCallback,
  onCloseModal: () => void,
  onSuccess?: () => void,
};

const DeleteLeadCallbackModal = (props: Props) => {
  const { callback, onCloseModal, onSuccess } = props;
  const { callbackId, lead, callbackTime } = callback;

  // ===== Requests ===== //
  const [deleteLeadCallbackMutation, { loading }] = useDeleteLeadCallbackMutation();

  // ===== Handlers ===== //
  const handleSubmit = async () => {
    try {
      await deleteLeadCallbackMutation({ variables: { callbackId } });

      onSuccess?.();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CALLBACKS.DELETE_MODAL.NOTIFICATION.LEAD_TITLE'),
        message: I18n.t('CALLBACKS.DELETE_MODAL.SUCCESSFULLY_DELETED'),
      });
    } catch (e) {
      onCloseModal();

      notify({
        level: LevelType.ERROR,
        title: I18n.t('CALLBACKS.DELETE_MODAL.NOTIFICATION.LEAD_TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  return (
    <Modal
      warning
      onCloseModal={onCloseModal}
      title={I18n.t('CALLBACKS.DELETE_MODAL.LEAD_HEADER')}
      buttonTitle={I18n.t('COMMON.BUTTONS.DELETE')}
      styleButton="danger"
      disabled={loading}
      clickSubmit={handleSubmit}
    >
      {I18n.t('CALLBACKS.DELETE_MODAL.LEAD_ACTION_TEXT', {
        fullName: lead?.fullName || '',
        time: moment.utc(callbackTime).local().format('HH:mm:ss'),
        date: moment.utc(callbackTime).local().format('DD.MM.YYYY'),
      })}
    </Modal>
  );
};

export default React.memo(DeleteLeadCallbackModal);
