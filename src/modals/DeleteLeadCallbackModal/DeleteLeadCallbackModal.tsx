import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { LeadCallback } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import EventEmitter, { LEAD_CALLBACK_RELOAD } from 'utils/EventEmitter';
import { Button } from 'components/Buttons';
import { useDeleteLeadCallbackMutation } from './graphql/__generated__/DeleteLeadCallbackMutation';
import './DeleteLeadCallbackModal.scss';

export type Props = {
  callback: LeadCallback,
  onCloseModal: () => void,
  onSuccess?: () => void,
};

const DeleteLeadCallbackModal = (props: Props) => {
  const {
    callback,
    onCloseModal,
    onSuccess = () => {},
  } = props;
  const { callbackId, lead, callbackTime } = callback;

  // ===== Requests ===== //
  const [deleteLeadCallbackMutation, { loading }] = useDeleteLeadCallbackMutation();

  // ===== Handlers ===== //
  const handleSubmit = async () => {
    try {
      await deleteLeadCallbackMutation({ variables: { callbackId } });

      EventEmitter.emit(LEAD_CALLBACK_RELOAD);

      onSuccess();
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
          data-testid="DeleteLeadCallbackModal-cancelButton"
          onClick={onCloseModal}
          secondary
        >
          {I18n.t('COMMON.CANCEL')}
        </Button>

        <Button
          data-testid="DeleteLeadCallbackModal-deleteButton"
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

export default React.memo(DeleteLeadCallbackModal);
