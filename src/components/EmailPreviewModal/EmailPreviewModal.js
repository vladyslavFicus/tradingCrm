import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import PropTypes from 'constants/propTypes';
import EmailPreview from 'components/EmailPreview';
import './EmailPreviewModal.scss';

class EmailPreviewModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    email: PropTypes.email.isRequired,
  };

  render() {
    const {
      email: {
        subject,
        name,
        text,
      },
      onCloseModal,
      isOpen,
    } = this.props;

    return (
      <Modal toggle={onCloseModal} isOpen={isOpen}>
        <ModalHeader toggle={onCloseModal}>{I18n.t('EMAILS.MODALS.EMAIL_PREVIEW.TITLE')}</ModalHeader>
        <ModalBody>
          <If condition={name}>
            <label className="EmailPreviewModal__label">{I18n.t('EMAILS.MODALS.EMAIL_PREVIEW.NAME_LABEL')}</label>
            <span className="EmailPreviewModal__pseudo-input">{name}</span>
          </If>
          <label className="EmailPreviewModal__label">{I18n.t('EMAILS.MODALS.EMAIL_PREVIEW.SUBJECT_LABEL')}</label>
          <span className="EmailPreviewModal__pseudo-input">{subject}</span>
          <EmailPreview text={text} label={I18n.t('EMAILS.MODALS.EMAIL_PREVIEW.PREVIEW_LABEL')} />
        </ModalBody>
      </Modal>
    );
  }
}

export default EmailPreviewModal;
