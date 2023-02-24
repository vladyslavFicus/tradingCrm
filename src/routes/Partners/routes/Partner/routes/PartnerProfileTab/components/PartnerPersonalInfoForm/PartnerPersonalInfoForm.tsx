import React from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { QueryResult } from '@apollo/client';
import { getBrand } from 'config';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { withStorage } from 'providers/StorageProvider';
import { Authority } from '__generated__/types';
import permissions from 'config/permissions';
import countryList from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import CopyToClipboard from 'components/CopyToClipboard';
import {
  FormikInputField,
  FormikSelectField,
  FormikCheckbox,
  FormikMultiInputField,
  FormikInputRangeField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { attributeLabels } from './constants';
import { useUpdatePartnerMutation } from './graphql/__generated__/UpdatePartnerMutation';
import { PartnerQuery } from './graphql/__generated__/PartnerQuery';
import './PartnerPersonalInfoForm.scss';

type FormValues = {
  firstName: string,
  lastName: string,
  email: string,
  country: string,
  phone: string,
  externalAffiliateId: string,
  public: boolean,
  cdeAffiliate: boolean,
  permission: {
    allowedIpAddresses: Array<string>,
    restrictedSources: Array<string>,
    restrictedReferrals: Array<string>,
    forbiddenCountries?: Array<string>,
    showNotes?: boolean,
    showSalesStatus?: boolean,
    showFTDAmount?: boolean,
    showKycStatus?: boolean,
    showAutologinUrl?: boolean,
    cumulativeDeposit?: boolean,
    minFtdDeposit?: number,
  },
}

type Props = {
  auth: Authority,
  partnerData: QueryResult<PartnerQuery>,
}

const PartnerPersonalInfoForm = (props: Props) => {
  const {
    partnerData,
    auth: { role, department },
  } = props;

  const {
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
  } = partnerData.data?.partner || {};

  const permission = usePermission();

  const deniesUpdate = permission.denies(permissions.PARTNERS.UPDATE_PROFILE);

  const [updatePartnerMutation] = useUpdatePartnerMutation();

  const handleSubmit = async (values: FormValues) => {
    try {
      await updatePartnerMutation({
        variables: {
          uuid: uuid as string,
          ...values,
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

  const { cumulativeDeposit, minFtdDeposit } = partnerPermission || {};

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
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </If>
            </div>

            <div className="PartnerPersonalInfoForm__fields">
              <Field
                name="firstName"
                className="PartnerPersonalInfoForm__field"
                label={I18n.t(attributeLabels.firstName)}
                placeholder={I18n.t(attributeLabels.firstName)}
                component={FormikInputField}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="lastName"
                className="PartnerPersonalInfoForm__field"
                label={I18n.t(attributeLabels.lastName)}
                placeholder={I18n.t(attributeLabels.lastName)}
                component={FormikInputField}
                disabled={isSubmitting || deniesUpdate}
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
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="public"
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
                label={I18n.t(attributeLabels.phone)}
                placeholder={I18n.t(attributeLabels.phone)}
                component={FormikInputField}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="country"
                className="PartnerPersonalInfoForm__field"
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
                label={I18n.t(attributeLabels.allowedIpAddresses)}
                placeholder={I18n.t(attributeLabels.allowedIpAddresses)}
                component={FormikMultiInputField}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="permission.forbiddenCountries"
                className="PartnerPersonalInfoForm__field"
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
                label={I18n.t(attributeLabels.restrictedSources)}
                placeholder={I18n.t(attributeLabels.restrictedSources)}
                component={FormikMultiInputField}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="permission.restrictedReferrals"
                className="PartnerPersonalInfoForm__field"
                label={I18n.t(attributeLabels.restrictedReferrals)}
                placeholder={I18n.t(attributeLabels.restrictedReferrals)}
                component={FormikMultiInputField}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="permission.showNotes"
                component={FormikCheckbox}
                label={I18n.t(attributeLabels.showNotes)}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="permission.showSalesStatus"
                component={FormikCheckbox}
                label={I18n.t(attributeLabels.showSalesStatus)}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="permission.showFTDAmount"
                component={FormikCheckbox}
                label={I18n.t(attributeLabels.showFTDAmount)}
                disabled={isSubmitting || deniesUpdate}
              />

              <Field
                name="permission.showKycStatus"
                component={FormikCheckbox}
                label={I18n.t(attributeLabels.showKycStatus)}
                disabled={isSubmitting || deniesUpdate}
              />

              <If condition={department === 'ADMINISTRATION' && role === 'ADMINISTRATION'}>
                <Field
                  name="cdeAffiliate"
                  component={FormikCheckbox}
                  label={I18n.t(attributeLabels.cdeAffiliate)}
                  disabled={isSubmitting}
                />
              </If>

              <Field
                name="permission.showAutologinUrl"
                component={FormikCheckbox}
                label={I18n.t(attributeLabels.showAutologinUrl)}
                disabled={isSubmitting || deniesUpdate}
              />

              <div className="PartnerPersonalInfoForm__deposit_settings">
                <Field
                  name="permission.minFtdDeposit"
                  className="PartnerPersonalInfoForm__field"
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

export default compose(
  React.memo,
  withStorage(['auth']),
)(PartnerPersonalInfoForm);
