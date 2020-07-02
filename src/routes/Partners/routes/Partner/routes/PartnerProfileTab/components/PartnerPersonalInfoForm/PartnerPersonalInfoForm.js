import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { withPermission } from 'providers/PermissionsProvider';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import countryList from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField, FormikSelectField, FormikCheckbox, FormikMultiInputField } from 'components/Formik';
import { Button } from 'components/UI';
import updatePartnerMutation from './graphql/UpdatePartnerMutation';
import './PartnerPersonalInfoForm.scss';

const attributeLabels = {
  firstName: 'PARTNERS.PROFILE.PERSONAL_INFORMATION.FORM.LABELS.FIRST_NAME',
  lastName: 'PARTNERS.PROFILE.PERSONAL_INFORMATION.FORM.LABELS.LAST_NAME',
  email: 'COMMON.EMAIL',
  externalAffiliateId: 'COMMON.EXTERNAL_AFILIATE_ID',
  public: 'PARTNERS.PROFILE.PERSONAL_INFORMATION.FORM.PUBLIC_CHECKBOX',
  country: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.COUNTRY',
  phone: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.PHONE',
  allowedIpAddresses: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.WHITE_LISTED_IP',
  forbiddenCountries: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.RESTRICTED_COUNTRIES',
  showNotes: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.SHOW_NOTES',
  showFTDAmount: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.SHOW_FTD_AMOUNT',
  showKycStatus: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.SHOW_KYC_STATUS',
  showSalesStatus: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.SHOW_SALES_STATUS',
};

class PartnerPersonalInfoForm extends PureComponent {
  static propTypes = {
    partnerData: PropTypes.query({
      partner: PropTypes.shape({
        data: PropTypes.partner,
      }),
    }).isRequired,
    updatePartner: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
  }

  get isReadOnly() {
    const permittedRights = [permissions.PARTNERS.UPDATE_PROFILE];

    return !(new Permissions(permittedRights).check(this.props.permission.permissions));
  }

  handleSubmit = async ({
    allowedIpAddresses,
    forbiddenCountries,
    showNotes,
    showSalesStatus,
    showFTDAmount,
    showKycStatus,
    ...rest
  }, { setSubmitting }) => {
    const { updatePartner, partnerData, notify } = this.props;
    const { uuid } = get(partnerData, 'data.partner.data') || {};

    setSubmitting(false);

    const { data: { partner: { updatePartner: { error } } } } = await updatePartner({
      variables: {
        uuid,
        permission: {
          allowedIpAddresses,
          forbiddenCountries: forbiddenCountries || [],
          showNotes,
          showSalesStatus,
          showFTDAmount,
          showKycStatus,
        },
        ...rest,
      },
    });

    if (!error) {
      partnerData.refetch();
    }

    notify({
      level: error ? 'error' : 'success',
      title: error
        ? I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_ERROR.TITLE')
        : I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_SUCCESS.TITLE'),
      message: error
        ? I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_ERROR.MESSAGE')
        : I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_SUCCESS.MESSAGE'),
    });
  };

  render() {
    const { partnerData } = this.props;
    const {
      firstName,
      lastName,
      email,
      externalAffiliateId,
      public: partnerPublic,
      phone,
      country,
      permission: partnerPermissions,
    } = get(partnerData, 'data.partner.data') || {};

    return (
      <div className="PartnerPersonalInfoForm">
        <Formik
          initialValues={{
            firstName,
            lastName,
            email,
            externalAffiliateId,
            public: partnerPublic,
            phone,
            country,
            ...partnerPermissions,
          }}
          validate={createValidator({
            firstName: ['required', 'string'],
            lastName: ['required', 'string'],
            email: ['required', 'email'],
            country: [`in:,${Object.keys(countryList).join()}`],
            phone: 'string',
            externalAffiliateId: 'string',
            public: 'boolean',
            allowedIpAddresses: 'listedIP\'s',
            forbiddenCountries: ['array', `in:,${Object.keys(countryList).join()}`],
            showNotes: 'boolean',
            showSalesStatus: 'boolean',
            showFTDAmount: 'boolean',
            showKycStatus: 'boolean',
          }, translateLabels(attributeLabels), false)}
          onSubmit={this.handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, dirty }) => (
            <Form>
              <div className="PartnerPersonalInfoForm__header">
                <div className="PartnerPersonalInfoForm__title">
                  {I18n.t('PARTNERS.PROFILE.PERSONAL_INFORMATION.TITLE')}
                </div>

                <If condition={dirty && !isSubmitting && !this.isReadOnly}>
                  <div className="PartnerPersonalInfoForm__actions">
                    <Button
                      small
                      primary
                      type="submit"
                    >
                      {I18n.t('COMMON.SAVE_CHANGES')}
                    </Button>
                  </div>
                </If>
              </div>

              <div className="PartnerPersonalInfoForm__fields">
                <Field
                  name="firstName"
                  className="PartnerPersonalInfoForm__field"
                  label={I18n.t(attributeLabels.firstName)}
                  placeholder={I18n.t(attributeLabels.firstName)}
                  component={FormikInputField}
                  disabled={isSubmitting || this.isReadOnly}
                />

                <Field
                  name="lastName"
                  className="PartnerPersonalInfoForm__field"
                  label={I18n.t(attributeLabels.lastName)}
                  placeholder={I18n.t(attributeLabels.lastName)}
                  component={FormikInputField}
                  disabled={isSubmitting || this.isReadOnly}
                />

                <Field
                  name="email"
                  className="PartnerPersonalInfoForm__field"
                  label={I18n.t(attributeLabels.email)}
                  placeholder={I18n.t(attributeLabels.email)}
                  component={FormikInputField}
                  disabled
                />

                <Field
                  name="externalAffiliateId"
                  className="PartnerPersonalInfoForm__field"
                  label={I18n.t(attributeLabels.externalAffiliateId)}
                  placeholder={I18n.t(attributeLabels.externalAffiliateId)}
                  component={FormikInputField}
                  disabled={isSubmitting || this.isReadOnly}
                />

                <Field
                  name="public"
                  component={FormikCheckbox}
                  label={I18n.t('PARTNERS.MODALS.NEW_PARTNER.PUBLIC_CHECKBOX')}
                  disabled={isSubmitting || this.isReadOnly}
                />
              </div>

              <hr />

              <div className="PartnerPersonalInfoForm__header">
                <div className="PartnerPersonalInfoForm__title">
                  {I18n.t('PARTNERS.PROFILE.CONTACTS.TITLE')}
                </div>
              </div>

              <div className="PartnerPersonalInfoForm__fields">
                <Field
                  name="phone"
                  className="PartnerPersonalInfoForm__field"
                  label={I18n.t(attributeLabels.phone)}
                  placeholder={I18n.t(attributeLabels.phone)}
                  component={FormikInputField}
                  disabled={isSubmitting || this.isReadOnly}
                />

                <Field
                  name="country"
                  className="PartnerPersonalInfoForm__field"
                  label={I18n.t(attributeLabels.country)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.COUNTRY')}
                  component={FormikSelectField}
                  searchable
                  disabled={isSubmitting || this.isReadOnly}
                >
                  {Object.entries(countryList).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Field>

                <Field
                  name="allowedIpAddresses"
                  className="PartnerPersonalInfoForm__field"
                  label={I18n.t(attributeLabels.allowedIpAddresses)}
                  placeholder={I18n.t(attributeLabels.allowedIpAddresses)}
                  component={FormikMultiInputField}
                  disabled={isSubmitting || this.isReadOnly}
                />

                <Field
                  name="forbiddenCountries"
                  className="PartnerPersonalInfoForm__field"
                  label={I18n.t(attributeLabels.forbiddenCountries)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.COUNTRY')}
                  component={FormikSelectField}
                  searchable
                  multiple
                  disabled={isSubmitting || this.isReadOnly}
                >
                  {Object.entries(countryList).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Field>

                <Field
                  name="showNotes"
                  component={FormikCheckbox}
                  label={I18n.t(attributeLabels.showNotes)}
                  disabled={isSubmitting || this.isReadOnly}
                />

                <Field
                  name="showSalesStatus"
                  component={FormikCheckbox}
                  label={I18n.t(attributeLabels.showSalesStatus)}
                  disabled={isSubmitting || this.isReadOnly}
                />

                <Field
                  name="showFTDAmount"
                  component={FormikCheckbox}
                  label={I18n.t(attributeLabels.showFTDAmount)}
                  disabled={isSubmitting || this.isReadOnly}
                />

                <Field
                  name="showKycStatus"
                  component={FormikCheckbox}
                  label={I18n.t(attributeLabels.showKycStatus)}
                  disabled={isSubmitting || this.isReadOnly}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withNotifications,
  withRequests({
    updatePartner: updatePartnerMutation,
  }),
)(PartnerPersonalInfoForm);
