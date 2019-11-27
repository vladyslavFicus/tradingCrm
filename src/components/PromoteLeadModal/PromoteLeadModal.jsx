import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import languages from 'constants/languageNames';
import { getActiveBrandConfig, getAvailableLanguages } from 'config';
import { createValidator, translateLabels } from 'utils/validator';
import countryList from 'utils/countryList';
import { generate } from 'utils/password';
import { InputField, NasSelectField } from 'components/ReduxForm';
import attributeLabels from './constants';

const FORM_NAME = 'promoteLeadModalForm';

class PromoteLead extends PureComponent {
  handleGeneratePassword = () => {
    this.props.change('password', generate());
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
      supportedCurrencies,
      onSubmit,
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
          onSubmit={handleSubmit(onSubmit)}
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
                disabled
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
              <If condition={supportedCurrencies.length > 1}>
                <Field
                  name="currency"
                  component={NasSelectField}
                  label={I18n.t(attributeLabels.currency)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                >
                  {
                    supportedCurrencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))
                  }
                </Field>
              </If>
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
                type="text"
                onIconClick={this.handleGeneratePassword}
                inputAddon={<span className="icon-generate-password" />}
                inputAddonPosition="right"
                label={I18n.t(attributeLabels.password)}
                component={InputField}
              />
              <Field
                name="languageCode"
                label={I18n.t(attributeLabels.language)}
                component={NasSelectField}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              >
                {getAvailableLanguages().map(languageCode => (
                  <option key={languageCode} value={languageCode}>
                    {I18n.t(get(languages.find(item => item.languageCode === languageCode), 'languageName'))}
                  </option>
                ))}
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

PromoteLead.propTypes = {
  initialValues: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  supportedCurrencies: PropTypes.array.isRequired,
  change: PropTypes.func.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  size: PropTypes.string,
  error: PropTypes.any,
};

PromoteLead.defaultProps = {
  size: null,
  error: null,
};

const PromoteLeadModal = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate: createValidator({
    firstName: ['required', 'string'],
    lastName: ['required', 'string'],
    email: ['required', 'string'],
    password: ['required', `regex:${getActiveBrandConfig().password.pattern}`],
    languageCode: ['required', 'string'],
    country: ['required', 'string'],
    currency: ['required', 'string'],
  }, translateLabels(attributeLabels), false),
})(PromoteLead);

export default PromoteLeadModal;
