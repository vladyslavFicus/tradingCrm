import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getFormValues, Field, reduxForm } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { SelectField, CheckBox } from '../../../../../../../../components/ReduxForm';
import PropTypes from '../../../../../../../../constants/propTypes';
import { createValidator } from '../../../../../../../../utils/validator';
import { categories as kycCategories, refuseRequestReasons } from '../../../../../../../../constants/kyc';
import { targetTypes } from '../../../../../../../../constants/note';
import NoteButton from '../../../../../../../../components/NoteButton';

const FORM_NAME = 'refuseModal';
const attributeLabels = {
  [kycCategories.KYC_PERSONAL]: 'Refuse Identity verification',
  [`${kycCategories.KYC_PERSONAL}_reason`]: 'Identity rejection reason',
  [kycCategories.KYC_ADDRESS]: 'Refuse Address verification',
  [`${kycCategories.KYC_ADDRESS}_reason`]: 'Address rejection reason',
};

const validator = (values) => {
  const rules = {
    [kycCategories.KYC_PERSONAL]: ['boolean'],
    [`${kycCategories.KYC_PERSONAL}_reason`]: ['string'],
    [kycCategories.KYC_ADDRESS]: ['boolean'],
    [`${kycCategories.KYC_ADDRESS}_reason`]: ['string'],
  };

  if (values[kycCategories.KYC_PERSONAL]) {
    rules[`${kycCategories.KYC_PERSONAL}_reason`].push('required');
  }

  if (values[kycCategories.KYC_ADDRESS]) {
    rules[`${kycCategories.KYC_ADDRESS}_reason`].push('required');
  }

  if (!values[kycCategories.KYC_PERSONAL] && !values[kycCategories.KYC_ADDRESS]) {
    rules[kycCategories.KYC_PERSONAL].push('required');
    rules[kycCategories.KYC_ADDRESS].push('required');
  }

  return createValidator(rules, attributeLabels, false)(values);
};

class RefuseModal extends Component {
  static propTypes = {
    profile: PropTypes.userProfile.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    className: PropTypes.string,
    selectedValues: PropTypes.object,
    reasons: PropTypes.arrayOf(PropTypes.string),
    note: PropTypes.noteEntity,
    onManageNote: PropTypes.func.isRequired,
  };

  static defaultProps = {
    handleSubmit: null,
    className: 'modal-danger',
    reasons: [],
    note: null,
    pristine: false,
    submitting: false,
    invalid: false,
    selectedValues: null,
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
      this.context.onAddNoteClick(null, targetTypes.KYC_REFUSE)(target, this.getNotePopoverParams());
    }
  };

  renderRejectByType = (type) => {
    const { selectedValues, reasons } = this.props;

    return (
      <Fragment>
        <div className="text-center">
          <Field
            className="d-inline-block"
            id={`${type}-reject-reason-checkbox`}
            name={type}
            component={CheckBox}
            type="checkbox"
            label={attributeLabels[type]}
          />
        </div>
        <If condition={selectedValues && selectedValues[type]}>
          <Field
            name={`${type}_reason`}
            component={SelectField}
          >
            <option>{I18n.t('COMMON.CHOOSE_REASON')}</option>
            {reasons.map(item => (
              <option key={item} value={item}>
                {renderLabel(item, refuseRequestReasons)}
              </option>
            ))}
          </Field>
        </If>
      </Fragment>
    );
  };

  render() {
    const {
      profile,
      onSubmit,
      handleSubmit,
      pristine,
      submitting,
      invalid,
      onClose,
      className,
      note,
    } = this.props;

    return (
      <Modal isOpen toggle={onClose} className={className}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={onClose}>KYC Request rejection</ModalHeader>
          <ModalBody>
            <div className="text-center">
              <h1>Refusing verification</h1>

              <div className="margin-top-10">
                <div className="font-weight-700">{`${profile.firstName} ${profile.lastName}`}</div>
                <div>Account language: {profile.languageCode}</div>
              </div>
            </div>

            <div className="margin-top-30">
              {this.renderRejectByType(kycCategories.KYC_PERSONAL)}
            </div>
            <div className="margin-top-5">
              {this.renderRejectByType(kycCategories.KYC_ADDRESS)}
            </div>

            <div className="text-center margin-top-20">
              <NoteButton
                id="refuse-kyc-note-button"
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
              Cancel
            </button>
            {' '}
            <button
              type="submit"
              className="btn btn-danger-outline"
              disabled={pristine || submitting || invalid}
            >
              Refuse & Send notification
            </button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default compose(
  connect(state => ({
    selectedValues: getFormValues(FORM_NAME)(state),
  })),
  reduxForm({
    form: FORM_NAME,
    validate: validator,
  }),
)(RefuseModal);
