import React, { useState } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Button } from 'components';
import { Utils } from '@crm/common';
import Modal from 'components/Modal';
import './ConfirmActionModal.scss';

export type Props = {
  uuid?: string,
  fullName?: string,
  actionText?: string,
  modalTitle?: string,
  additionalText?: string,
  submitButtonLabel?: string,
  cancelButtonLabel?: string,
  className?: string,
  hideSubmit?: boolean,
  hideCancel?: boolean,
  onSubmit: () => void,
  onCloseModal: () => void,
  onCancel?: () => void,
  onCloseCallback?: () => void,
}

const ConfirmActionModal = (props: Props) => {
  const {
    uuid = '',
    fullName = '',
    actionText,
    modalTitle,
    additionalText,
    submitButtonLabel,
    cancelButtonLabel,
    className,
    hideSubmit,
    hideCancel,
    onSubmit,
    onCloseModal,
    onCloseCallback,
    onCancel,
  } = props;

  const [submit, setSubmit] = useState<boolean>(false);

  const handleClose = async () => {
    await onCancel?.();
    await onCloseModal();
    await onCloseCallback?.();
  };

  const handleSubmit = async () => {
    if (!submit) {
      setSubmit(true);

      await onSubmit();
      await onCloseCallback?.();
      await onCloseModal();

      setSubmit(false);
    }
  };

  return (
    <Modal
      className={classNames('ConfirmActionModal', className)}
      onCloseModal={handleClose}
      title={modalTitle || I18n.t('MODALS.CONFIRM_ACTION_MODAL.TITLE')}
      renderFooter={(
        <>
          <If condition={!hideCancel}>
            <Button
              tertiary
              onClick={handleClose}
              data-testid="ConfirmActionModal-cancelButton"
            >
              {cancelButtonLabel || I18n.t('COMMON.CANCEL')}
            </Button>
          </If>

          <If condition={!hideSubmit}>
            <Button
              autoFocus
              danger
              type="submit"
              disabled={submit}
              onClick={handleSubmit}
              data-testid="ConfirmActionModal-confirmButton"
            >
              {submitButtonLabel || I18n.t('COMMON.BUTTONS.CONFIRM')}
            </Button>
          </If>
        </>
      )}
    >
      <div className="ConfirmActionModal__row ConfirmActionModal__action-text">
        {actionText || I18n.t('MODALS.CONFIRM_ACTION_MODAL.DESCRIPTION')}
      </div>

      <div className="ConfirmActionModal__row">
        <If condition={!!fullName}>
          <span className="ConfirmActionModal__fullname">{fullName}</span>
        </If>

        <If condition={!!fullName && !!uuid}>
          <b> - </b>
        </If>

        <If condition={!!uuid}>
          <span className="ConfirmActionModal__uuid">{Utils.uuidShortify(uuid)}</span>
        </If>

        <If condition={!!additionalText}>
          <span className="ConfirmActionModal__additional-text">{additionalText}</span>
        </If>
      </div>
    </Modal>
  );
};

export default React.memo(ConfirmActionModal);
