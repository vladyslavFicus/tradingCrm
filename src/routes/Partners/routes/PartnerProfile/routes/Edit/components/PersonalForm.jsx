import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import Regulated from 'components/Regulated';
import { InputField, MultiInputField, NasSelectField, CheckBox } from 'components/ReduxForm';
import { createValidator, translateLabels } from 'utils/validator';
import countries from 'utils/countryList';
import { personalFormAttributeLabels as attributeLabels } from './constants';
import { affiliateTypes, affiliateTypeLabels } from '../../../../../constants';

class PersonalForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    disabled: PropTypes.bool.isRequired,
    initialValues: PropTypes.shape({
      affiliateType: PropTypes.string.isRequired,
    }).isRequired,
    serverError: PropTypes.string.isRequired,
  };

  static defaultProps = {
    handleSubmit: null,
    pristine: false,
    submitting: false,
  };

  render() {
    const {
      initialValues: { affiliateType },
      handleSubmit,
      serverError,
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
          <div className="col-xl-4">
            <Field
              name="affiliateType"
              label={I18n.t('COMMON.PARTNER_TYPE')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_PARTNER_TYPE')}
              disabled
              component={NasSelectField}
              withAnyOption={false}
              searchable={false}
              position="vertical"
              showErrorMessage
            >
              {Object
                .keys(affiliateTypeLabels)
                .map(label => <option key={label} value={label}>{I18n.t(affiliateTypeLabels[label])}</option>)
              }
            </Field>
          </div>
          <div className="col-xl-4">
            <Field
              name="externalAffiliateId"
              label={I18n.t('COMMON.EXTERNAL_AFILIATE_ID')}
              type="text"
              component={InputField}
              showErrorMessage
              position="vertical"
              disabled={affiliateType === affiliateTypes.NULLPOINT}
              meta={{
                error: serverError === 'error.affiliate.externalId.already.exists'
                  ? I18n.t('error.validation.externalId.exists')
                  : '',
                touched: true,
              }}
            />
          </div>
          <If condition={affiliateType !== affiliateTypes.NULLPOINT}>
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
          </If>
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
    affiliateType: ['required', 'string'],
    externalAffiliateId: 'string',
    public: 'boolean',
    cellexpert: 'boolean',
    allowedIpAddresses: 'listedIP\'s',
  }, translateLabels(attributeLabels), false),
  enableReinitialize: true,
})(PersonalForm);
