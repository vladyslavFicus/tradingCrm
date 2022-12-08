import React, { useState } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { LeadCallback } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import EventEmitter, { LEAD_CALLBACK_RELOAD } from 'utils/EventEmitter';
import { Button } from 'components/UI';
import { useDeleteLeadCallbackMutation } from './graphql/__generated__/DeleteLeadCallbackMutation';
import './DeleteLeadCallbackModal.scss';

type Props = {
  callback: LeadCallback,
  onCloseModal: () => void,
  onSuccess: () => void,
};

const DeleteLeadCallbackModal = (props: Props) => {
  const {
    callback,
    onCloseModal,
    onSuccess = () => {},
  } = props;
  const { lead, callbackTime } = callback;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deleteLeadCallbackMutation] = useDeleteLeadCallbackMutation();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await deleteLeadCallbackMutation({ variables: { callbackId: callback.callbackId } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CALLBACKS.DELETE_MODAL.NOTIFICATION.LEAD_TITLE'),
        message: I18n.t('CALLBACKS.DELETE_MODAL.SUCCESSFULLY_DELETED'),
      });

      EventEmitter.emit(LEAD_CALLBACK_RELOAD);

      onSuccess();
      onCloseModal();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CALLBACKS.DELETE_MODAL.NOTIFICATION.LEAD_TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });

      onCloseModal();
    }

    setIsSubmitting(false);
  };

  return (
    <Modal className="DeleteLeadCallbackModal" toggle={onCloseModal} isOpen>
      <ModalHeader
        className="DeleteLeadCallbackModal__header"
        toggle={onCloseModal}
      >
        {I18n.t('CALLBACKS.DELETE_MODAL.LEAD_HEADER')}
      </ModalHeader>

      <ModalBody>
        {I18n.t('CALLBACKS.DELETE_MODAL.LEAD_ACTION_TEXT', {
          fullName: lead?.fullName || '',
          time: moment.utc(callbackTime).local().format('HH:mm:ss'),
          date: moment.utc(callbackTime).local().format('DD.MM.YYYY'),
        })}
      </ModalBody>

      <ModalFooter>
        <Button
          onClick={onCloseModal}
          secondary
        >
          {I18n.t('COMMON.CANCEL')}
        </Button>

        <Button
          disabled={isSubmitting}
          onClick={handleSubmit}
          type="submit"
          danger
        >
          {I18n.t('COMMON.BUTTONS.DELETE')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default React.memo(DeleteLeadCallbackModal);
