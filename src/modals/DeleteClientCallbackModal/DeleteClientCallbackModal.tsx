import React, { useState } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ClientCallback } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import EventEmitter, { CLIENT_CALLBACK_RELOAD } from 'utils/EventEmitter';
import { Button } from 'components/UI';
import { useDeleteClientCallbackMutation } from './graphql/__generated__/DeleteClientCallbackMutation';
import './DeleteClientCallbackModal.scss';

type Props = {
  callback: ClientCallback,
  onCloseModal: () => void,
  onSuccess: () => void,
};

const DeleteClientCallbackModal = (props: Props) => {
  const {
    callback,
    onCloseModal,
    onSuccess = () => {},
  } = props;
  const { client, callbackTime } = callback;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deleteClientCallbackMutation] = useDeleteClientCallbackMutation();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await deleteClientCallbackMutation({ variables: { callbackId: callback.callbackId } });

      EventEmitter.emit(CLIENT_CALLBACK_RELOAD);

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CALLBACKS.DELETE_MODAL.NOTIFICATION.CLIENT_TITLE'),
        message: I18n.t('CALLBACKS.DELETE_MODAL.SUCCESSFULLY_DELETED'),
      });

      onSuccess();
      onCloseModal();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('CALLBACKS.DELETE_MODAL.NOTIFICATION.CLIENT_TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });

      onCloseModal();
    }

    setIsSubmitting(false);
  };

  return (
    <Modal className="DeleteClientCallbackModal" toggle={onCloseModal} isOpen>
      <ModalHeader
        className="DeleteClientCallbackModal__header"
        toggle={onCloseModal}
      >
        {I18n.t('CALLBACKS.DELETE_MODAL.CLIENT_HEADER')}
      </ModalHeader>

      <ModalBody>
        {I18n.t('CALLBACKS.DELETE_MODAL.CLIENT_ACTION_TEXT', {
          fullName: client?.fullName || '',
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

export default React.memo(DeleteClientCallbackModal);
