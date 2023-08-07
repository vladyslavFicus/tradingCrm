import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Partner } from '__generated__/types';
import countryList from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import CopyToClipboard from 'components/CopyToClipboard';
import {
  FormikInputField,
  FormikSelectField,
  FormikCheckbox,
  FormikMultiInputField,
  FormikInputRangeField } from 'components/Formik';
import { Button } from 'components';
import usePartnerPersonalInfoForm, { FormValues } from 'routes/Partners/routes/hooks/usePartnerPersonalInfoForm';
import { attributeLabels } from './constants';
import './PartnerPersonalInfoForm.scss';

type Props = {
  partner: Partner,
  onRefetch: () => void,
};

const PartnerPersonalInfoForm = (props: Props) => {
  const {
    partner: {
      uuid,
      firstName,
      lastName,
      email,
      externalAffiliateId,
      public: partnerPublic,
      phone,
      country,
      cdeAffiliate,
      permission: partnerPermission,
    },
    onRefetch,
  } = props;

  const partner = { uuid, permission: partnerPermission } as Partner;

  const {
    deniesUpdate,
    brand,
    department,
    role,
    minFtdDeposit,
    cumulativeDeposit,
    LevelType,
    handleSubmit,
  } = usePartnerPersonalInfoForm({ partner, onRefetch });

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
          permission: {
            ...partnerPermission,
            cumulativeDeposit: minFtdDeposit ? cumulativeDeposit : true,
          },
        } as FormValues}
        validate={createValidator({
          firstName: ['required', 'string'],
          lastName: ['required', 'string'],
          email: ['required', 'email'],
          country: [`in:,${Object.keys(countryList).join()}`],
          phone: 'string',
          externalAffiliateId: 'string',
          public: 'boolean',
          cdeAffiliate: 'boolean',
          permission: {
            allowedIpAddresses: 'listedIP\'s',
            forbiddenCountries: ['array', `in:,${Object.keys(countryList).join()}`],
            showNotes: 'boolean',
            showSalesStatus: 'boolean',
            showFTDAmount: 'boolean',
            showKycStatus: 'boolean',
            showAutologinUrl: 'boolean',
            cumulativeDeposit: 'boolean',
            minFtdDeposit: ['numeric', 'min:1', 'max:10000'],
          },
        }, translateLabels(attributeLabels), false)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty, values, setFieldValue }) => (
          <Form>
            <div className="PartnerPersonalInfoForm__header">
              <div className="PartnerPersonalInfoForm__title">
                {I18n.t('PARTNERS.PROFILE.PERSONAL_INFORMATION.TITLE')}
              </div>

              <If condition={dirty && !isSubmitting && !deniesUpdate}>
                <Button
                  small
                  primary
                  type="submit"
                  className="PartnerPersonalInfoForm__actions"
                  data-testid="PartnerPersonalInfoForm-saveChangesButton"
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </If>
            </div>

            <div className="PartnerPersonalInfoForm__fields">
              <Field
                name="firstName"
                className="PartnerPersonalInfoForm__field"
                data-testid="PartnerPersonalInfoForm-firstNameInput"
                label={I18n.t(attributeLabels.firstName)}
                placeholder={I18n.t(attributeLabels.firstName)}
                component={FormikInputField}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="lastName"
                className="PartnerPersonalInfoForm__field"
                data-testid="PartnerPersonalInfoForm-lastNameInput"
                label={I18n.t(attributeLabels.lastName)}
                placeholder={I18n.t(attributeLabels.lastName)}
                component={FormikInputField}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="email"
                className="PartnerPersonalInfoForm__field"
                data-testid="PartnerPersonalInfoForm-emailInput"
                label={I18n.t(attributeLabels.email)}
                placeholder={I18n.t(attributeLabels.email)}
                component={FormikInputField}
                disabled
              />

              <Field
                name="externalAffiliateId"
                className="PartnerPersonalInfoForm__field"
                data-testid="PartnerPersonalInfoForm-externalAffiliateIdInput"
                label={I18n.t(attributeLabels.externalAffiliateId)}
                placeholder={I18n.t(attributeLabels.externalAffiliateId)}
                component={FormikInputField}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="public"
                data-testid="PartnerPersonalInfoForm-publicCheckbox"
                component={FormikCheckbox}
                label={I18n.t('PARTNERS.MODALS.NEW_PARTNER.PUBLIC_CHECKBOX')}
                disabled={isSubmitting || deniesUpdate}
              />

              <If condition={!!values.externalAffiliateId && !!values.public}>
                <CopyToClipboard
                  withNotification
                  notificationLevel={LevelType.SUCCESS}
                  notificationTitle={I18n.t('COMMON.NOTIFICATIONS.COPIED')}
                  notificationMessage={I18n.t('COMMON.NOTIFICATIONS.COPY_LINK')}
                  className="PartnerPersonalInfoForm__ib-link-container"
                  text={
                        brand.clientPortalLanding.signUp
                          ? `${brand.clientPortalLanding.signUp}/e/${values.externalAffiliateId}`
                          : `${brand.clientPortal.url}/e/${values.externalAffiliateId}`}
                >
                  <span className="PartnerPersonalInfoForm__ib-link">
                    (&nbsp;
                    {
                          brand.clientPortalLanding.signUp
                            ? `${brand.clientPortalLanding.signUp}/e/${values.externalAffiliateId}`
                            : `${brand.clientPortal.url}/e/${values.externalAffiliateId}`
                        }
                    &nbsp;)
                  </span>
                </CopyToClipboard>
              </If>
            </div>

            <hr />

            <div className="PartnerPersonalInfoForm__title">
              {I18n.t('PARTNERS.PROFILE.CONTACTS.TITLE')}
            </div>

            <div className="PartnerPersonalInfoForm__fields">
              <Field
                name="phone"
                className="PartnerPersonalInfoForm__field"
                data-testid="PartnerPersonalInfoForm-phoneInput"
                label={I18n.t(attributeLabels.phone)}
                placeholder={I18n.t(attributeLabels.phone)}
                component={FormikInputField}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="country"
                className="PartnerPersonalInfoForm__field"
                data-testid="PartnerPersonalInfoForm-countrySelect"
                label={I18n.t(attributeLabels.country)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.COUNTRY')}
                component={FormikSelectField}
                searchable
                disabled={isSubmitting || deniesUpdate}
              >
                {Object.entries(countryList).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field>

              <Field
                name="permission.allowedIpAddresses"
                className="PartnerPersonalInfoForm__field"
                data-testid="PartnerPersonalInfoForm-permissionAllowedIpAddressesMultiInput"
                label={I18n.t(attributeLabels.allowedIpAddresses)}
                placeholder={I18n.t(attributeLabels.allowedIpAddresses)}
                component={FormikMultiInputField}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="permission.forbiddenCountries"
                className="PartnerPersonalInfoForm__field"
                data-testid="PartnerPersonalInfoForm-permissionForbiddenCountriesSelect"
                label={I18n.t(attributeLabels.forbiddenCountries)}
                placeholder={I18n.t('COMMON.SELECT_OPTION.COUNTRY')}
                component={FormikSelectField}
                searchable
                multiple
                disabled={isSubmitting || deniesUpdate}
              >
                {Object.entries(countryList).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Field>

              <Field
                name="permission.restrictedSources"
                className="PartnerPersonalInfoForm__field"
                data-testid="PartnerPersonalInfoForm-permissionRestrictedSourcesMultiInput"
                label={I18n.t(attributeLabels.restrictedSources)}
                placeholder={I18n.t(attributeLabels.restrictedSources)}
                component={FormikMultiInputField}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="permission.restrictedReferrals"
                className="PartnerPersonalInfoForm__field"
                data-testid="PartnerPersonalInfoForm-permissionRestrictedReferralsMultiInput"
                label={I18n.t(attributeLabels.restrictedReferrals)}
                placeholder={I18n.t(attributeLabels.restrictedReferrals)}
                component={FormikMultiInputField}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="permission.showNotes"
                data-testid="PartnerPersonalInfoForm-permissionShowNotesCheckbox"
                component={FormikCheckbox}
                label={I18n.t(attributeLabels.showNotes)}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="permission.showSalesStatus"
                data-testid="PartnerPersonalInfoForm-permissionShowSalesStatusCheckbox"
                component={FormikCheckbox}
                label={I18n.t(attributeLabels.showSalesStatus)}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="permission.showFTDAmount"
                data-testid="PartnerPersonalInfoForm-permissionShowFTDAmountCheckbox"
                component={FormikCheckbox}
                label={I18n.t(attributeLabels.showFTDAmount)}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="permission.showKycStatus"
                data-testid="PartnerPersonalInfoForm-permissionShowKycStatusCheckbox"
                component={FormikCheckbox}
                label={I18n.t(attributeLabels.showKycStatus)}
                disabled={isSubmitting || deniesUpdate}
              />

              <If condition={department === 'ADMINISTRATION' && role === 'ADMINISTRATION'}>
                <Field
                  name="cdeAffiliate"
                  data-testid="PartnerPersonalInfoForm-cdeAffiliateCheckbox"
                  component={FormikCheckbox}
                  label={I18n.t(attributeLabels.cdeAffiliate)}
                  disabled={isSubmitting}
                />
              </If>

              <Field
                name="permission.showAutologinUrl"
                data-testid="PartnerPersonalInfoForm-permissionShowAutologinUrlCheckbox"
                component={FormikCheckbox}
                label={I18n.t(attributeLabels.showAutologinUrl)}
                disabled={isSubmitting || deniesUpdate}
              />

              <div className="PartnerPersonalInfoForm__deposit_settings">
                <Field
                  name="permission.minFtdDeposit"
                  className="PartnerPersonalInfoForm__field"
                  data-testid="PartnerPersonalInfoForm-permissionMinFtdDepositInputRange"
                  label={I18n.t(attributeLabels.minFtdDeposit)}
                  placeholder={I18n.t(attributeLabels.minFtdDeposit)}
                  component={FormikInputRangeField}
                  onChange={(value: number) => {
                    if (!value) {
                      setFieldValue('cumulativeDeposit', true);
                    } else {
                      setFieldValue('cumulativeDeposit', cumulativeDeposit);
                    }
                  }}
                  errorText={I18n.t('PARTNERS.PROFILE.CONTACTS.FORM.ERRORS.MIN_FTD_DEPOSIT', { max: 10000, min: 1 })}
                  disabled={isSubmitting || deniesUpdate}
                />

                <Field
                  name="permission.cumulativeDeposit"
                  data-testid="PartnerPersonalInfoForm-permissionCumulativeDepositCheckbox"
                  component={FormikCheckbox}
                  label={I18n.t(attributeLabels.cumulativeDeposit)}
                  hint={!values.permission.minFtdDeposit && I18n.t(attributeLabels.cumulativeDepositHint)}
                  disabled={isSubmitting || deniesUpdate || !values.permission.minFtdDeposit}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default React.memo(PartnerPersonalInfoForm);
