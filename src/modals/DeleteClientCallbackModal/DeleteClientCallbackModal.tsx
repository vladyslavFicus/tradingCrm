import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ClientCallback } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import EventEmitter, { CLIENT_CALLBACK_RELOAD } from 'utils/EventEmitter';
import { Button } from 'components/Buttons';
import { useDeleteClientCallbackMutation } from './graphql/__generated__/DeleteClientCallbackMutation';
import './DeleteClientCallbackModal.scss';

type Props = {
  callback: ClientCallback,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const DeleteClientCallbackModal = (props: Props) => {
  const {
    callback,
    onSuccess = () => {},
    onCloseModal,
  } = props;
  const { callbackId, client, callbackTime } = callback;

  // ===== Requests ===== //
  const [deleteClientCallbackMutation, { loading }] = useDeleteClientCallbackMutation();

  // ===== Handlers ===== //
  const handleSubmit = async () => {
    try {
      await deleteClientCallbackMutation({ variables: { callbackId } });

      EventEmitter.emit(CLIENT_CALLBACK_RELOAD);

      onSuccess();
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
          disabled={loading}
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
