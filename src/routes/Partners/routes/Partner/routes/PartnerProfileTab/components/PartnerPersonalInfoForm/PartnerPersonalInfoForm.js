import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { getBrand } from 'config';
import { notify, LevelType } from 'providers/NotificationProvider';
import { withPermission } from 'providers/PermissionsProvider';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import countryList from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import CopyToClipboard from 'components/CopyToClipboard';
import {
  FormikInputField,
  FormikSelectField,
  FormikCheckbox,
  FormikMultiInputField,
  FormikInputRangeField } from 'components/Formik';
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
  restrictedSources: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.RESTRICTED_SOURCES',
  restrictedReferrals: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.RESTRICTED_REFERRALS',
  showNotes: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.SHOW_NOTES',
  showFTDAmount: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.SHOW_FTD_AMOUNT',
  showKycStatus: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.SHOW_KYC_STATUS',
  showSalesStatus: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.SHOW_SALES_STATUS',
  cdeAffiliate: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.CDE_AFFILIATE',
  cumulativeDeposit: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.CUMULATIVE_DEPOSIT',
  cumulativeDepositHint: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.CUMULATIVE_DEPOSIT_HINT',
  minFtdDeposit: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.MIN_FTD_LIMIT',
  showAutologinUrl: 'PARTNERS.PROFILE.CONTACTS.FORM.LABELS.SHOW_AUTO_LOGIN_URL',
};

class PartnerPersonalInfoForm extends PureComponent {
  static propTypes = {
    partnerData: PropTypes.query({
      partner: PropTypes.partner,
    }).isRequired,
    updatePartner: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
    auth: PropTypes.auth.isRequired,
  }

  get isReadOnly() {
    const permittedRights = [permissions.PARTNERS.UPDATE_PROFILE];

    return !(new Permissions(permittedRights).check(this.props.permission.permissions));
  }

  handleSubmit = async ({
    allowedIpAddresses,
    forbiddenCountries,
    restrictedSources,
    restrictedReferrals,
    showNotes,
    showSalesStatus,
    showFTDAmount,
    showKycStatus,
    cumulativeDeposit,
    showAutologinUrl,
    minFtdDeposit,
    ...rest
  }, { setSubmitting }) => {
    const { updatePartner, partnerData } = this.props;
    const { uuid } = get(partnerData, 'data.partner') || {};

    setSubmitting(false);

    try {
      await updatePartner({
        variables: {
          uuid,
          permission: {
            allowedIpAddresses,
            forbiddenCountries: forbiddenCountries || [],
            restrictedSources: restrictedSources || [],
            restrictedReferrals: restrictedReferrals || [],
            showNotes,
            showSalesStatus,
            showFTDAmount,
            showKycStatus,
            cumulativeDeposit,
            showAutologinUrl,
            minFtdDeposit,
          },
          ...rest,
        },
      });

      partnerData.refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_SUCCESS.TITLE'),
        message: I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_SUCCESS.MESSAGE'),
      });
    } catch (e) {
      const error = get(e, 'graphQLErrors.0.extensions.response.body.error');

      if (error === 'error.affiliate.externalId.already.exists') {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.TITLE'),
          message: I18n.t('PARTNERS.NOTIFICATIONS.EXISTING_PARTNER_EXTERNAL_ID.MESSAGE'),
        });

        return;
      }

      notify({
        level: LevelType.ERROR,
        title: I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_ERROR.TITLE'),
        message: I18n.t('PARTNERS.NOTIFICATIONS.UPDATE_PARTNER_ERROR.MESSAGE'),
      });
    }
  };

  render() {
    const {
      partnerData,
      auth: { role, department },
    } = this.props;
    const {
      firstName,
      lastName,
      email,
      externalAffiliateId,
      public: partnerPublic,
      phone,
      country,
      permission: partnerPermissions,
      cdeAffiliate,
    } = get(partnerData, 'data.partner') || {};
    const { cumulativeDeposit, minFtdDeposit } = partnerPermissions;

    const brand = getBrand();

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
            cdeAffiliate,
            ...partnerPermissions,
            cumulativeDeposit: minFtdDeposit ? cumulativeDeposit : true,
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
            cdeAffiliate: 'boolean',
            showAutologinUrl: 'boolean',
            cumulativeDeposit: 'boolean',
            minFtdDeposit: ['numeric', 'min:1', 'max:10000'],
          }, translateLabels(attributeLabels), false)}
          onSubmit={this.handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, dirty, values, setFieldValue }) => (
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

                <If condition={values.externalAffiliateId && values.public}>
                  <div className="PartnerPersonalInfoForm__ib-link-container">
                    (&nbsp;
                    <CopyToClipboard
                      withNotification
                      notificationLevel="success"
                      notificationTitle={I18n.t('COMMON.NOTIFICATIONS.COPIED')}
                      notificationMessage={I18n.t('COMMON.NOTIFICATIONS.COPY_LINK')}
                      text={
                        brand.clientPortalLanding.signUp
                          ? `${brand.clientPortalLanding.signUp}/e/${values.externalAffiliateId}`
                          : `${brand.clientPortal.url}/e/${values.externalAffiliateId}`}
                    >
                      <span className="PartnerPersonalInfoForm__ib-link">
                        {
                          brand.clientPortalLanding.signUp
                            ? `${brand.clientPortalLanding.signUp}/e/${values.externalAffiliateId}`
                            : `${brand.clientPortal.url}/e/${values.externalAffiliateId}`
                        }
                      </span>
                    </CopyToClipboard>
                    &nbsp;)
                  </div>
                </If>
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
                  name="restrictedSources"
                  className="PartnerPersonalInfoForm__field"
                  label={I18n.t(attributeLabels.restrictedSources)}
                  placeholder={I18n.t(attributeLabels.restrictedSources)}
                  component={FormikMultiInputField}
                  disabled={isSubmitting || this.isReadOnly}
                />

                <Field
                  name="restrictedReferrals"
                  className="PartnerPersonalInfoForm__field"
                  label={I18n.t(attributeLabels.restrictedReferrals)}
                  placeholder={I18n.t(attributeLabels.restrictedReferrals)}
                  component={FormikMultiInputField}
                  disabled={isSubmitting || this.isReadOnly}
                />

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

                <If condition={['ADMINISTRATION'].includes(department) && ['ADMINISTRATION'].includes(role)}>
                  <Field
                    name="cdeAffiliate"
                    component={FormikCheckbox}
                    label={I18n.t(attributeLabels.cdeAffiliate)}
                    disabled={isSubmitting}
                  />
                </If>

                <Field
                  name="showAutologinUrl"
                  component={FormikCheckbox}
                  label={I18n.t(attributeLabels.showAutologinUrl)}
                  disabled={isSubmitting || this.isReadOnly}
                />

                <div className="PartnerPersonalInfoForm__deposit_settings">
                  <Field
                    name="minFtdDeposit"
                    className="PartnerPersonalInfoForm__field"
                    label={I18n.t(attributeLabels.minFtdDeposit)}
                    placeholder={I18n.t(attributeLabels.minFtdDeposit)}
                    component={FormikInputRangeField}
                    onChange={(value) => {
                      if (!value) {
                        setFieldValue('cumulativeDeposit', true);
                      } else {
                        setFieldValue('cumulativeDeposit', cumulativeDeposit);
                      }
                    }}
                    errorText={I18n.t('PARTNERS.PROFILE.CONTACTS.FORM.ERRORS.MIN_FTD_DEPOSIT', { max: 10000, min: 1 })}
                    disabled={isSubmitting || this.isReadOnly}
                  />
                  <Field
                    name="cumulativeDeposit"
                    component={FormikCheckbox}
                    label={I18n.t(attributeLabels.cumulativeDeposit)}
                    hint={!values.minFtdDeposit && I18n.t(attributeLabels.cumulativeDepositHint)}
                    disabled={isSubmitting || this.isReadOnly || !values.minFtdDeposit}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default compose(
  withStorage(['auth']),
  withPermission,
  withRequests({
    updatePartner: updatePartnerMutation,
  }),
)(PartnerPersonalInfoForm);
