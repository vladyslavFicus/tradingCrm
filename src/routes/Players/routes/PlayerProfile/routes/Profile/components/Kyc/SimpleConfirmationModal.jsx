import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import Uuid from '../../../../../../../../components/Uuid';
import { targetTypes } from '../../../../../../../../constants/note';
import PropTypes from '../../../../../../../../constants/propTypes';
import NoteButton from '../../../../../../../../components/NoteButton';

class SimpleConfirmationModal extends Component {
  static propTypes = {
    profile: PropTypes.userProfile.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    className: PropTypes.string,
    modalTitle: PropTypes.string,
    actionText: PropTypes.string,
    submitButtonLabel: PropTypes.string,
    note: PropTypes.noteEntity,
    onManageNote: PropTypes.func.isRequired,
    form: PropTypes.string.isRequired,
  };
  static defaultProps = {
    handleSubmit: null,
    className: 'modal-danger',
    modalTitle: 'KYC - verification',
    actionText: 'You are about to verify player',
    submitButtonLabel: 'verify',
    note: null,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    hidePopover: PropTypes.func.isRequired,
  };

  getNotePopoverParams = () => ({
    placement: 'bottom',
    onSubmit: this.handleSubmitNote,
    onDelete: this.handleDeleteNote,
  });

  handleSubmitNote = (data) => {
    this.props.onManageNote(data);
    this.context.hidePopover();
  };

  handleDeleteNote = () => {
    this.props.onManageNote(null);
    this.context.hidePopover();
  };

  handleNoteClick = (target) => {
    const { note } = this.props;
    if (note) {
      this.context.onEditNoteClick(target, note, this.getNotePopoverParams());
    } else {
      this.context.onAddNoteClick(null, targetTypes.KYC_VERIFY)(target, this.getNotePopoverParams());
    }
  };

  render() {
    const {
      profile: { playerUUID },
      onSubmit,
      handleSubmit,
      onClose,
      className,
      modalTitle,
      actionText,
      submitButtonLabel,
      note,
      form,
    } = this.props;

    const submitButtonId = submitButtonLabel.split(' ').join('-').replace(/&/, 'and').toLowerCase();

    return (
      <Modal isOpen toggle={onClose} className={className}>
        <ModalHeader toggle={onClose}>{modalTitle}</ModalHeader>
        <ModalBody id="simple-confirmation-modal-form" tag="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="text-center mx-auto width-300">
            <strong>{actionText}</strong>
            {' - '}
            <Uuid uuid={playerUUID} uuidPrefix="PL" />
          </div>
          <div className="text-center margin-top-20">
            <NoteButton
              id={`${form}-verify-kyc-note-button`}
              note={note}
              onClick={this.handleNoteClick}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-default-outline mr-auto"
          >
            {I18n.t('COMMON.CANCEL')}
          </button>
          <button
            type="submit"
            form="simple-confirmation-modal-form"
            className="btn btn-danger-outline"
            id={`kyc-${submitButtonId}-btn`}
          >
            {submitButtonLabel}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default reduxForm()(SimpleConfirmationModal);
