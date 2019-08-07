import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import renderLabel from '../../../../../../../../utils/renderLabel';
import Uuid from '../../../../../../../../components/Uuid';
import { createValidator, translateLabels } from '../../../../../../../../utils/validator';
import { SelectField } from '../../../../../../../../components/ReduxForm';
import { targetTypes } from '../../../../../../../../constants/note';
import { verifyRequestReasons } from '../../../../../../../../constants/kyc';
import NoteButton from '../../../../../../../../components/NoteButton';
import { attributeLabels } from './constants';

class RequestKycVerificationModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool,
    playerUUID: PropTypes.string,
    fullName: PropTypes.string,
    note: PropTypes.noteEntity,
    onManageNote: PropTypes.func.isRequired,
    reasons: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    playerUUID: '',
    fullName: '',
    title: '',
    pristine: false,
    submitting: false,
    note: null,
    handleSubmit: null,
    reasons: [],
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
      reasons,
    } = this.props;

    return (
      <Modal isOpen toggle={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <If condition={!!title}>
            <ModalHeader toggle={onClose}>
              {title}
            </ModalHeader>
          </If>
          <ModalBody>
            <div className="text-center mx-auto width-300">
              <strong>
                {I18n.t('PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.ACTION_TEXT', { fullName })}
              </strong>
              {' - '}
              <Uuid uuid={playerUUID} uuidPrefix="PL" />
            </div>
            <Field
              name="reason"
              label={I18n.t(attributeLabels.reason)}
              component={SelectField}
            >
              <option>{I18n.t('COMMON.CHOOSE_REASON')}</option>
              {reasons.map(item => (
                <option key={item} value={item}>
                  {renderLabel(item, verifyRequestReasons)}
                </option>
              ))}
            </Field>
            <div className="text-center">
              <NoteButton
                id="request-kyc-verification-note-button"
                note={note}
                onClick={this.handleNoteClick}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              className="mr-auto"
              color="secondary"
              onClick={onClose}
            >
              {I18n.t('COMMON.CANCEL')}
            </Button>
            <Button
              color="danger"
              type="submit"
              disabled={pristine || submitting || invalid}
            >
              {I18n.t('PLAYER_PROFILE.PROFILE.SEND_KYC_REQUEST.BUTTON')}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default reduxForm({
  form: 'requestKycVerificationModal',
  validate: (values, props) => createValidator({
    reason: `required|string|in:${props.reasons.join()}`,
  }, translateLabels(attributeLabels), false)(values),
})(RequestKycVerificationModal);
