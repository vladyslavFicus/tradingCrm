import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import EmailPreview from 'components/EmailPreview';
import './EmailPreviewModal.scss';

type Email = {
  id: string,
  text: string,
  name?: string,
  subject?: string,
};

type Props = {
  onCloseModal: () => void,
  isOpen: boolean,
  email: Email,
};

const EmailPreviewModal = (props: Props) => {
  const { email, onCloseModal, isOpen } = props;
  const { subject, name, text } = email;

  return (
    <Modal toggle={onCloseModal} isOpen={isOpen}>
      <ModalHeader toggle={onCloseModal}>
        {I18n.t('EMAILS.MODALS.EMAIL_PREVIEW.TITLE')}
      </ModalHeader>

      <ModalBody>
        <If condition={!!name}>
          <label className="EmailPreviewModal__label">
            {I18n.t('EMAILS.MODALS.EMAIL_PREVIEW.NAME_LABEL')}
          </label>
          <span className="EmailPreviewModal__pseudo-input">{name}</span>
        </If>

        <If condition={!!subject}>
          <label className="EmailPreviewModal__label">
            {I18n.t('EMAILS.MODALS.EMAIL_PREVIEW.SUBJECT_LABEL')}
          </label>
          <span className="EmailPreviewModal__pseudo-input">
            {subject}
          </span>
        </If>

        <EmailPreview
          text={text}
          label={I18n.t('EMAILS.MODALS.EMAIL_PREVIEW.PREVIEW_LABEL')}
        />
      </ModalBody>
    </Modal>
  );
};

export default React.memo(EmailPreviewModal);
