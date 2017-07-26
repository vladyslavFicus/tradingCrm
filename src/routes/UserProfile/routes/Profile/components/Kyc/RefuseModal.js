import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getFormValues, Field, reduxForm } from 'redux-form';
import classNames from 'classnames';
import { TextAreaField } from '../../../../../../components/ReduxForm';
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
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    className: PropTypes.string,
    selectedValues: PropTypes.object,
  };

  renderRejectByType = (type) => {
    const { selectedValues } = this.props;

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
            <label htmlFor={`${type}-reject-reason-checkbox`}>{attributeLabels[type]}</label>
          </div>

          {
            selectedValues && selectedValues[type] &&
            <div className="form-group padding-top-20">
              <label>{attributeLabels[`${type}_reason`]}</label>
              <Field
                name={`${type}_reason`}
                component={TextAreaField}
                position="vertical"
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
      className,
    } = this.props;

    const modalClassName = classNames(className, 'modal-danger');

    return (
      <Modal isOpen toggle={onClose} className={modalClassName}>
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
          </ModalBody>

          <ModalFooter>
            <button
              onClick={onClose}
              className="btn btn-default-outline pull-left"
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
  })(RefuseModal),
);
