import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { InputField, MultiInputField, NasSelectField, CheckBox } from 'components/ReduxForm';
import { createValidator, translateLabels } from 'utils/validator';
import countries from 'utils/countryList';
import { personalFormAttributeLabels as attributeLabels } from './constants';

class PersonalForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    disabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
  };

  render() {
    const {
      handleSubmit,
      submitting,
      onSubmit,
      pristine,
      disabled,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row margin-bottom-20">
          <div className="col-xl-6 personal-form-heading">
            {I18n.t('PARTNER_PROFILE.PERSONAL_INFORMATION.TITLE')}
          </div>
          <If condition={!(pristine || submitting) && !disabled}>
            <div className="col-xl-6 text-right">
              <button
                className="btn btn-sm btn-primary pull-right"
                type="submit"
                id="operators-profile-save-changes-button"
              >
                {I18n.t('COMMON.SAVE_CHANGES')}
              </button>
            </div>
          </If>
        </div>
        <div className="row">
          <div className="col-xl-4">
            <Field
              name="firstName"
              label={I18n.t(attributeLabels.firstName)}
              type="text"
              component={InputField}
              showErrorMessage
              position="vertical"
              disabled={disabled}
              id="operators-profile-first-name"
            />
          </div>
          <div className="col-xl-4">
            <Field
              name="lastName"
              label={I18n.t(attributeLabels.lastName)}
              type="text"
              component={InputField}
              showErrorMessage
              disabled={disabled}
              position="vertical"
              id="operators-profile-last-name"
            />
          </div>
          <div className="col-xl-4">
            <Field
              name="email"
              label={I18n.t(attributeLabels.email)}
              type="text"
              disabled
              component={InputField}
              showErrorMessage
              position="vertical"
            />
          </div>
        </div>
        <hr />
        <div className="personal-form-heading margin-bottom-20">
          {I18n.t('PARTNER_PROFILE.DETAILS.LABEL.CONTACTS')}
        </div>
        <div className="row">
          <div className="col-xl-4">
            <Field
              name="phone"
              label={I18n.t(attributeLabels.phoneNumber)}
              type="text"
              component={InputField}
              showErrorMessage
              disabled={disabled}
              position="vertical"
              id="operators-profile-phone-number"
            />
          </div>
          <div className="col-xl-4">
            <Field
              name="country"
              label={I18n.t(attributeLabels.country)}
              type="text"
              placeholder={I18n.t('COMMON.SELECT_OPTION.COUNTRY')}
              component={NasSelectField}
              disabled={disabled}
            >
              {Object
                .keys(countries)
                .map(key => <option key={key} value={key}>{countries[key]}</option>)
              }
            </Field>
          </div>
          <div className="col-xl-4">
            <Field
              name="allowedIpAddresses"
              label={I18n.t(attributeLabels.whiteListedIps)}
              type="text"
              component={MultiInputField}
            />
          </div>
          <div className="col-xl-4">
            <Field
              name="forbiddenCountries"
              label={I18n.t(attributeLabels.restrictedCountries)}
              type="text"
              placeholder={I18n.t('COMMON.SELECT_OPTION.COUNTRY')}
              component={NasSelectField}
              position="vertical"
              multiple
            >
              {Object
                .keys(countries)
                .map(key => <option key={key} value={key}>{countries[key]}</option>)
              }
            </Field>
            <Field
              name="showNotes"
              type="checkbox"
              component={CheckBox}
              label={I18n.t('PARTNERS.SHOW_NOTES')}
            />
            <Field
              name="showSalesStatus"
              type="checkbox"
              component={CheckBox}
              label={I18n.t('PARTNERS.SHOW_SALES_STATUS')}
            />
            <Field
              name="showFTDAmount"
              type="checkbox"
              component={CheckBox}
              label={I18n.t('PARTNERS.SHOW_FTD_AMOUNT')}
            />
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'updatePartnerProfilePersonal',
  validate: createValidator({
    firstName: ['required', 'string'],
    lastName: ['required', 'string'],
    email: ['required', 'email'],
    country: [`in:,${Object.keys(countries).join()}`],
    phone: 'string',
    allowedIpAddresses: 'listedIP\'s',
  }, translateLabels(attributeLabels), false),
  enableReinitialize: true,
})(PersonalForm);