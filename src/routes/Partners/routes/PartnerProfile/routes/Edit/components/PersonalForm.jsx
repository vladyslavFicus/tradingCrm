import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, getFormValues } from 'redux-form';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import PropTypes from 'constants/propTypes';
import { platformTypes } from 'constants/platformTypes';
import Regulated from 'components/Regulated';
import { InputField, MultiInputField, NasSelectField, CheckBox } from 'components/ReduxForm';
import { createValidator, translateLabels } from 'utils/validator';
import { getAvailablePlatformTypes } from 'utils/tradingAccount';
import countries from 'utils/countryList';
import {
  personalFormAttributeLabels as attributeLabels,
  autoCreationOptions,
} from './constants';
import { satelliteOptions } from '../../../../../constants';

class PersonalForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    disabled: PropTypes.bool.isRequired,
    currentValues: PropTypes.shape({
      tradingAccountAutocreation: PropTypes.string,
    }),
    serverError: PropTypes.string.isRequired,
  };

  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
    currentValues: {},
  };

  render() {
    const {
      currentValues,
      handleSubmit,
      serverError,
      submitting,
      onSubmit,
      pristine,
      disabled,
    } = this.props;

    const availablePlatformTypes = getAvailablePlatformTypes();

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
          <If condition={satelliteOptions}>
            <div className="col-xl-4">
              <Field
                name="satellite"
                label={I18n.t('COMMON.SATELLITE')}
                placeholder={I18n.t('COMMON.NONE')}
                component={NasSelectField}
                withAnyOption={false}
                searchable={false}
                position="vertical"
                showErrorMessage
              >
                {satelliteOptions.map((satellite, key) => (
                  <option key={key} value={satellite.value}>{satellite.label}</option>
                ))}
              </Field>
            </div>
          </If>
          <div className="col-xl-4">
            <Field
              name="externalAffiliateId"
              label={I18n.t('COMMON.EXTERNAL_AFILIATE_ID')}
              type="text"
              component={InputField}
              showErrorMessage
              position="vertical"
              meta={{
                error: serverError === 'error.affiliate.externalId.already.exists'
                  ? I18n.t('error.validation.externalId.exists')
                  : '',
                touched: true,
              }}
            />
          </div>
        </div>
        <div className="row">
          <Regulated>
            <div className="col-xl-4">
              <Field
                name="tradingAccountAutocreation"
                label={I18n.t('PARTNERS.PROFILE.PERSONAL_FORM.LABELS.GENERATE_TRADING_ACCOUNT')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                component={NasSelectField}
                withAnyOption={false}
                searchable={false}
                position="vertical"
                showErrorMessage
              >
                {Object.keys(autoCreationOptions).map(key => (
                  <option key={key} value={autoCreationOptions[key].value}>
                    {I18n.t(autoCreationOptions[key].label)}
                  </option>
                ))}
              </Field>
            </div>

            <If condition={currentValues.tradingAccountAutocreation === 'ALLOW'}>
              <div className="col-xl-4">
                <Field
                  name="tradingAccountType"
                  label={I18n.t('PARTNERS.PROFILE.PERSONAL_FORM.LABELS.CHOOSE_TRADING_ACCOUNT_PLATFORM')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.PLATFORM')}
                  component={NasSelectField}
                  withAnyOption={false}
                  searchable={false}
                  disabled={availablePlatformTypes.length === 1}
                  position="vertical"
                  showErrorMessage
                >
                  {availablePlatformTypes.map(({ label, value }) => (
                    <option key={label} value={value}>{label}</option>
                  ))}
                </Field>
              </div>

              <div className="col-xl-4">
                <Field
                  name="tradingAccountCurrency"
                  label={I18n.t('PARTNERS.PROFILE.PERSONAL_FORM.LABELS.CHOOSE_TRADING_ACCOUNT_CURRENCY')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.CURRENCY')}
                  component={NasSelectField}
                  withAnyOption={false}
                  searchable={false}
                  position="vertical"
                  showErrorMessage
                >
                  {getBrand().currencies.supported.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </Field>
              </div>
            </If>
          </Regulated>
          <Field
            name="public"
            className="col-12 padding-left-35"
            component={CheckBox}
            type="checkbox"
            label={I18n.t('PARTNERS.MODALS.NEW_PARTNER.PUBLIC_CHECKBOX')}
          />
          <Regulated>
            <Field
              name="cellexpert"
              className="col-12 padding-left-35"
              component={CheckBox}
              type="checkbox"
              label={I18n.t('PARTNERS.MODALS.NEW_PARTNER.CELLEXPERT_CHECKBOX')}
            />
          </Regulated>
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
              label={I18n.t('PARTNERS.SHOW_NOTES')}
            />
            <Field
              name="showSalesStatus"
              type="checkbox"
              component={CheckBox}
              disabled={disabled}
              label={I18n.t('PARTNERS.SHOW_SALES_STATUS')}
            />
            <Field
              name="showFTDAmount"
              type="checkbox"
              component={CheckBox}
              disabled={disabled}
              label={I18n.t('PARTNERS.SHOW_FTD_AMOUNT')}
            />
            <Field
              name="showKycStatus"
              type="checkbox"
              component={CheckBox}
              disabled={disabled}
              label={I18n.t('PARTNERS.SHOW_KYC_STATUS')}
            />
          </div>
        </div>
      </form>
    );
  }
}

const FORM_NAME = 'updatePartnerProfilePersonal';

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(reduxForm({
  form: FORM_NAME,
  validate: createValidator({
    firstName: ['required', 'string'],
    lastName: ['required', 'string'],
    email: ['required', 'email'],
    country: [`in:,${Object.keys(countries).join()}`],
    phone: 'string',
    satellite: 'string',
    externalAffiliateId: 'string',
    public: 'boolean',
    cellexpert: 'boolean',
    allowedIpAddresses: 'listedIP\'s',
    tradingAccountAutocreation: [`in:,${Object.keys(autoCreationOptions).join()}`],
    tradingAccountType: [`in:,${platformTypes.map(type => type.value).join()}`],
    tradingAccountCurrency: [`in:,${getBrand().currencies.supported.join()}`],
  }, translateLabels(attributeLabels), false),
  enableReinitialize: true,
})(PersonalForm));
