import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../constants/propTypes';
import Uuid from '../../../../../../components/Uuid';
import { createValidator } from '../../../../../../utils/validator';
import { SelectField } from '../../../../../../components/ReduxForm';
import { verifyRequestReasons } from '../../../../../../constants/kyc';
import { targetTypes } from '../../../../../../constants/note';
import NoteButton from '../../../../../../components/NoteButton';

const attributeLabels = {
  reason: I18n.t('PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.CONSTANTS.REASON_LABEL'),
};
const validator = createValidator({
  reason: `required|string|in:${verifyRequestReasons.join()}`,
}, attributeLabels, false);

class RequestKycVerificationModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    playerUUID: PropTypes.string,
    fullName: PropTypes.string,
    note: PropTypes.noteEntity,
    onManageNote: PropTypes.func.isRequired,
  };
  static defaultProps = {
    playerUUID: '',
    fullName: '',
    title: '',
    show: false,
    pristine: false,
    submitting: false,
    invalid: false,
    note: null,
    handleSubmit: null,
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
      this.context.onAddNoteClick(null, targetTypes.KYC_REQUEST_VERIFICATION)(target, this.getNotePopoverParams());
    }
  };

  render() {
    const {
      title,
      onClose,
      onSubmit,
      handleSubmit,
      pristine,
      submitting,
      invalid,
      playerUUID,
      fullName,
      note,
    } = this.props;

    return (
      <Modal isOpen toggle={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {
            !!title &&
            <ModalHeader toggle={onClose}>
              {title}
            </ModalHeader>
          }
          <ModalBody>
            <div className="text-center center-block width-300">
              <strong>
                {I18n.t('PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.ACTION_TEXT', { fullName })}
              </strong>
              {' - '}
              <Uuid uuid={playerUUID} uuidPrefix="PL" />
            </div>

            <Field
              name="reason"
              label={attributeLabels.reason}
              component={SelectField}
              className={'form-control'}
              position="vertical"
            >
              <option>{I18n.t('PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.CONSTANTS.CHOOSE_REASON')}</option>
              {verifyRequestReasons.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>


            <div className="row text-center">
              <NoteButton
                id="request-kyc-verification-note-button"
                note={note}
                onClick={this.handleNoteClick}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              className="pull-left"
              color="secondary"
              onClick={onClose}
            >{I18n.t('COMMON.CANCEL')}</Button>
            <Button
              color="danger"
              type="submit"
              disabled={pristine || submitting || invalid}
            >{I18n.t('PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.BUTTON')}</Button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  form: 'requestKycVerificationModal',
  validate: validator,
})(RequestKycVerificationModal);
