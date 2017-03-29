import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getFormValues, Field, reduxForm } from 'redux-form';
import PropTypes from '../../../../../../constants/propTypes';
import { createValidator } from '../../../../../../utils/validator';
import { categories as kycCategories } from '../../../../../../constants/kyc';

const FORM_NAME = 'refuseModal';
const attributeLabels = {
  [kycCategories.KYC_PERSONAL]: 'Refuse Identity verification',
  [`${kycCategories.KYC_PERSONAL}_reason`]: 'Identity rejection reason',
  [kycCategories.KYC_ADDRESS]: 'Refuse Address verification',
  [`${kycCategories.KYC_ADDRESS}_reason`]: 'Address rejection reason',
};

const validator = createValidator({
  [kycCategories.KYC_PERSONAL]: 'boolean',
  [`${kycCategories.KYC_PERSONAL}_reason`]: [`required_if:${kycCategories.KYC_PERSONAL}`, 'string'],
  [kycCategories.KYC_ADDRESS]: 'boolean',
  [`${kycCategories.KYC_ADDRESS}_reason`]: [`required_if:${kycCategories.KYC_ADDRESS}`, 'string'],
}, attributeLabels, false);

class RefuseModal extends Component {
  static propTypes = {
    profile: PropTypes.userProfile.isRequired,
    onSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    className: PropTypes.string,
    selectedValues: PropTypes.object,
  };

  renderRejectByType = (type, label, reasonLabel, checked = false) => {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="text-center">
            <Field
              id={`${type}-reject-reason-checkbox`}
              name={type}
              component="input"
              type="checkbox"
            />
            {' '}
            <label htmlFor={`${type}-reject-reason-checkbox`}>{label}</label>
          </div>

          {
            checked &&
            <div className="form-group padding-top-20">
              <label>{reasonLabel}</label>
              <Field
                name={`${type}_reason`}
                component="textarea"
                className="form-control"
                rows="3"
              />
            </div>
          }
        </div>
      </div>
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
      selectedValues,
    } = this.props;

    return (
      <Modal isOpen toggle={onClose}>
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

            {this.renderRejectByType(
              kycCategories.KYC_PERSONAL,
              attributeLabels[kycCategories.KYC_PERSONAL],
              attributeLabels[`${kycCategories.KYC_PERSONAL}_reason`],
              selectedValues && selectedValues[kycCategories.KYC_PERSONAL]
                ? selectedValues[kycCategories.KYC_PERSONAL]
                : false
            )}
            {this.renderRejectByType(
              kycCategories.KYC_ADDRESS,
              attributeLabels[kycCategories.KYC_ADDRESS],
              attributeLabels[`${kycCategories.KYC_ADDRESS}_reason`],
              selectedValues && selectedValues[kycCategories.KYC_ADDRESS]
                ? selectedValues[kycCategories.KYC_ADDRESS]
                : false
            )}
          </ModalBody>

          <ModalFooter>
            <button
              onClick={onClose}
              className="btn btn-default-outline"
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

export default connect(state => ({ selectedValues: getFormValues(FORM_NAME)(state) }))(
  reduxForm({
    form: FORM_NAME,
    validate: validator,
  })(RefuseModal)
);
