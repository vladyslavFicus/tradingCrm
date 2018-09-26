import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import languages from '../../constants/languageNames';
import { createValidator, translateLabels } from '../../utils/validator';
import countryList from '../../utils/countryList';
import { InputField, NasSelectField } from '../../components/ReduxForm';
import attributeLabels from './constants';

const FORM_NAME = 'promoteLeadModalForm';

class PromoteLead extends Component {
  static propTypes = {
    initialValues: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    size: PropTypes.string,
    error: PropTypes.any,
  };

  static defaultProps = {
    size: null,
    error: null,
  };

  handleSubmit = (data) => {
    const { onSubmit } = this.props;

    return onSubmit(data);
  };

  render() {
    const {
      handleSubmit,
      onCloseModal,
      isOpen,
      invalid,
      submitting,
      size,
      initialValues: {
        firstName,
        lastName,
      },
      error,
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
        size={size}
        className="promote-lead-modal"
      >
        <ModalHeader toggle={onCloseModal}>
          {I18n.t('LEAD_PROFILE.PROMOTE_MODAL.HEADER')}
        </ModalHeader>
        <ModalBody
          tag="form"
          id="promote-lead-modal-form"
          onSubmit={handleSubmit(this.handleSubmit)}
        >
          <div className="mb-3 font-weight-700 text-center">
            {I18n.t('LEAD_PROFILE.PROMOTE_MODAL.BODY_HEADER', { fullName: `${firstName} ${lastName}` })}
          </div>
          <If condition={error}>
            <div className="mb-2 text-center color-danger">
              {error}
            </div>
          </If>
          <div className="row">
            <div className="col-6">
              <Field
                name="firstName"
                type="text"
                label={I18n.t(attributeLabels.firstName)}
                component={InputField}
              />
              <Field
                name="email"
                type="text"
                label={I18n.t(attributeLabels.email)}
                component={InputField}
              />
              <Field
                name="country"
                label={I18n.t(attributeLabels.country)}
                component={NasSelectField}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              >
                {Object.entries(countryList).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field>
              <Field
                name="salesRepresentative"
                label={I18n.t(attributeLabels.salesRepresentative)}
                component={NasSelectField}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                disabled
              >
                {[]}
              </Field>
            </div>
            <div className="col-6">
              <Field
                name="lastName"
                type="text"
                label={I18n.t(attributeLabels.lastName)}
                component={InputField}
              />
              <Field
                name="password"
                type="password"
                label={I18n.t(attributeLabels.password)}
                component={InputField}
              />
              <Field
                name="languageCode"
                label={I18n.t(attributeLabels.language)}
                component={NasSelectField}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              >
                {languages.map(({ languageName, languageCode }) => (
                  <option key={languageCode} value={languageCode}>
                    {I18n.t(languageName)}
                  </option>
                ))}
              </Field>
              <Field
                name="salesDesk"
                label={I18n.t(attributeLabels.salesDesk)}
                component={NasSelectField}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                disabled
              >
                {[]}
              </Field>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-default-outline"
            onClick={onCloseModal}
          >
            {I18n.t('COMMON.BUTTONS.CANCEL')}
          </button>
          <button
            type="submit"
            disabled={invalid || submitting}
            className="btn btn-primary"
            form="promote-lead-modal-form"
          >
            {I18n.t('COMMON.BUTTONS.CONFIRM')}
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

const PromoteLeadModal = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate: createValidator({
    firstName: ['required', 'string'],
    lastName: ['required', 'string'],
    email: ['required', 'string'],
    password: ['required', 'string', 'min:6'],
    languageCode: ['required', 'string'],
    country: ['required', 'string'],
  }, translateLabels(attributeLabels), false),
})(PromoteLead);

export default PromoteLeadModal;
