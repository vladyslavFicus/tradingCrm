import React from 'react';
import { Field, Form, Formik } from 'formik';
import I18n from 'i18n-js';
import { Button } from 'components';
import { PaymentDeposit } from '__generated__/types';
import countryList from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikCheckbox, FormikInputField, FormikSelectField } from 'components/Formik';
import { UncontrolledTooltip } from 'components';
import useFeatureForm from 'routes/FeatureToggles/hooks/useFeatureForm';
import { FormValues } from 'routes/FeatureToggles/types/featureForm';
import DepositeGrid from './components/DepositGrid';
import { attributeLabels, customErrors } from './constants';
import './FeatureForm.scss';

const FeatureForm = () => {
  const {
    id,
    restrictedCountries,
    paymentAmounts,
    profileDepositEnable,
    notificationCleanUpDays,
    hideChangePasswordCp,
    referralEnable,
    platformMaxAccounts,
    paymentDeposits,
    accountAutoCreations,
    affiliateClientAutoLogoutEnable,
    affiliateClientAutoLogoutMinutes,
    initialAccountAutoCreations,
    initialPlatformMaxAccounts,
    handleSubmit,
  } = useFeatureForm();

  return (
    <>
      <div className="FeatureForm">
        <Formik
          initialValues={{
            affiliateClientAutoLogoutMinutes: affiliateClientAutoLogoutMinutes || '',
            platformMaxAccounts: initialPlatformMaxAccounts,
            notificationCleanUpDays,
            depositButtons: {
              deposit1: paymentAmounts && paymentAmounts.length > 0 ? paymentAmounts[0] : 250,
              deposit2: paymentAmounts && paymentAmounts.length > 1 ? paymentAmounts[1] : 500,
              deposit3: paymentAmounts && paymentAmounts.length > 2 ? paymentAmounts[2] : 1000,
              deposit4: paymentAmounts && paymentAmounts.length > 3 ? paymentAmounts[3] : null,
              deposit5: paymentAmounts && paymentAmounts.length > 4 ? paymentAmounts[4] : null,
            },
            paymentDeposits: paymentDeposits || [],
            restrictedCountries: restrictedCountries || [],
            referralEnable: !!referralEnable,
            accountAutoCreations: initialAccountAutoCreations,
            profileDepositEnable: !!profileDepositEnable,
            hideChangePasswordCp: !!hideChangePasswordCp,
            autoLogout: !!affiliateClientAutoLogoutEnable,
          } as FormValues}
          validate={createValidator({
            restrictedCountries: ['array'],
            platformMaxAccounts: platformMaxAccounts?.reduce((acc, platformAcc) => (
              { ...acc, [platformAcc?.platformType]: ['required', 'numeric', 'greater:0'] }), {}),
            notificationCleanUpDays: ['required', 'numeric', 'greater:0'],
            depositButtons: {
              deposit1: ['required', 'numeric', 'greater:0'],
              deposit2: ['required', 'numeric', 'greater:0'],
              deposit3: ['required', 'numeric', 'greater:0'],
              deposit4: ['numeric', 'greater:0'],
              deposit5: ['numeric', 'greater:0'],
            },
            referralEnable: 'boolean',
            accountAutoCreations: accountAutoCreations?.reduce((acc, account) => (
              { ...acc,
                [`${account?.platformType}-${account?.accountCurrency}`]: 'boolean' }),
            {}),
            profileDepositEnable: 'boolean',
            hideChangePasswordCp: 'boolean',
            autoLogout: 'boolean',
            affiliateClientAutoLogoutMinutes: ['required_with:autoLogout', 'numeric', 'greater:0'],
          }, translateLabels(attributeLabels), false, customErrors)}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, dirty, values, setFieldValue }) => (
            <Form>
              <div className="FeatureForm__main-header">
                {I18n.t('FEATURE_TOGGLES.TITLE')}

                <Button
                  small
                  primary
                  type="submit"
                  disabled={isSubmitting || !dirty}
                  className="FeatureForm__button"
                  data-testid="FeatureForm-saveChangesButton"
                >
                  {I18n.t('COMMON.SAVE_CHANGES')}
                </Button>
              </div>

              <div className="FeatureForm__header">
                {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.COMMON')}
              </div>

              <div className="FeatureForm__fields">
                <div className="FeatureForm__block">
                  <span className="FeatureForm__block-title">
                    {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.RESTRICTED_COUNTRIES.TITLE')}

                    <i className="FeatureForm__icon-info fa fa-info-circle" id={`countries-${id}`} />

                    <UncontrolledTooltip
                      placement="right"
                      target={`countries-${id}`}
                      delay={{ show: 0, hide: 0 }}
                      fade={false}
                    >
                      {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.RESTRICTED_COUNTRIES.DESCRIPTION')}
                    </UncontrolledTooltip>
                  </span>

                  <Field
                    name="restrictedCountries"
                    className="FeatureForm__field"
                    data-testid="FeatureForm-restrictedCountriesSelect"
                    label={I18n.t(attributeLabels.restrictedCountries)}
                    component={FormikSelectField}
                    searchable
                    multiple
                    disabled={isSubmitting}
                  >
                    {Object.keys(countryList).map(country => (
                      <option key={country} value={country}>{countryList[country]}</option>
                    ))}
                  </Field>
                </div>

                <div className="FeatureForm__block">
                  <span className="FeatureForm__block-title">
                    {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.NOTIFICATION_CLEANUP.TITLE')}

                    <i className="FeatureForm__icon-info fa fa-info-circle" id={`cleanup-${id}`} />

                    <UncontrolledTooltip
                      placement="right"
                      target={`cleanup-${id}`}
                      delay={{ show: 0, hide: 0 }}
                      fade={false}
                    >
                      {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.NOTIFICATION_CLEANUP.DESCRIPTION')}
                    </UncontrolledTooltip>
                  </span>

                  <Field
                    name="notificationCleanUpDays"
                    className="FeatureForm__field"
                    data-testid="FeatureForm-notificationCleanUpDaysInput"
                    label={I18n.t(attributeLabels.notificationCleanUpDays)}
                    type="number"
                    component={FormikInputField}
                    disabled={isSubmitting}
                  />
                </div>

                <DepositeGrid
                  setFieldValue={setFieldValue}
                  depositAmounts={paymentDeposits as Array<PaymentDeposit>}
                />

                <div className="FeatureForm__block">
                  <span className="FeatureForm__block-title">
                    {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.REFERRAL_PROGRAM.TITLE')}

                    <i className="FeatureForm__icon-info fa fa-info-circle" id={`refferal-${id}`} />

                    <UncontrolledTooltip
                      placement="right"
                      target={`refferal-${id}`}
                      delay={{ show: 0, hide: 0 }}
                      fade={false}
                    >
                      {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.REFERRAL_PROGRAM.DESCRIPTION')}
                    </UncontrolledTooltip>
                  </span>

                  <Field
                    name="referralEnable"
                    data-testid="FeatureForm-referralEnableCheckbox"
                    className="FeatureForm__field-checkbox"
                    label={I18n.t(attributeLabels.referralEnable)}
                    component={FormikCheckbox}
                  />
                </div>

                <If condition={!!accountAutoCreations?.length}>
                  <div className="FeatureForm__block">
                    <span className="FeatureForm__block-title">
                      {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.AUTO_CREATING_TA.TITLE')}

                      <i className="FeatureForm__icon-info fa fa-info-circle" id={`creating-ta-${id}`} />

                      <UncontrolledTooltip
                        placement="right"
                        target={`creating-ta-${id}`}
                        delay={{ show: 0, hide: 0 }}
                        fade={false}
                      >
                        {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.AUTO_CREATING_TA.DESCRIPTION')}
                      </UncontrolledTooltip>
                    </span>

                    {accountAutoCreations?.map(({ accountCurrency, platformType }) => (
                      <Field
                        data-testid={`FeatureForm-accountAutoCreations${platformType}-${accountCurrency}`}
                        key={`${platformType}-${accountCurrency}`}
                        name={`accountAutoCreations.${platformType}-${accountCurrency}`}
                        className="FeatureForm__field-checkbox FeatureForm__field-checkbox--multi"
                        label={`${platformType}-${accountCurrency}`}
                        component={FormikCheckbox}
                      />
                    ))}
                  </div>
                </If>

                <div className="FeatureForm__block">
                  <span className="FeatureForm__block-title">
                    {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.DEPOSIT_BY_CLIENT.TITLE')}

                    <i className="FeatureForm__icon-info fa fa-info-circle" id={`clientDeposit-${id}`} />

                    <UncontrolledTooltip
                      placement="right"
                      target={`clientDeposit-${id}`}
                      delay={{ show: 0, hide: 0 }}
                      fade={false}
                    >
                      {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.DEPOSIT_BY_CLIENT.DESCRIPTION')}
                    </UncontrolledTooltip>
                  </span>

                  <Field
                    name="profileDepositEnable"
                    data-testid="FeatureForm-profileDepositEnableCheckbox"
                    className="FeatureForm__field-checkbox"
                    label={I18n.t(attributeLabels.profileDepositEnable)}
                    component={FormikCheckbox}
                  />
                </div>

                <div className="FeatureForm__header">
                  {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.CLIENT_PORTAL')}
                </div>

                <div className="FeatureForm__block">
                  <span className="FeatureForm__block-title">
                    {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.QUICK_DEPOSIT_BUTTONS.TITLE')}

                    <i className="FeatureForm__icon-info fa fa-info-circle" id={`quickDeposit-${id}`} />

                    <UncontrolledTooltip
                      placement="right"
                      target={`quickDeposit-${id}`}
                      delay={{ show: 0, hide: 0 }}
                      fade={false}
                    >
                      {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.QUICK_DEPOSIT_BUTTONS.DESCRIPTION')}
                    </UncontrolledTooltip>
                  </span>

                  <div className="FeatureForm__deposit-fields">
                    <Field
                      name="depositButtons.deposit1"
                      data-testid="FeatureForm-depositButtonsDeposit1Input"
                      className="FeatureForm__field FeatureForm__field--quick-deposit"
                      label={I18n.t(attributeLabels['depositButtons.deposit1'])}
                      type="number"
                      component={FormikInputField}
                      disabled={isSubmitting}
                    />

                    <Field
                      name="depositButtons.deposit2"
                      data-testid="FeatureForm-depositButtonsDeposit2Input"
                      className="FeatureForm__field FeatureForm__field--quick-deposit"
                      label={I18n.t(attributeLabels['depositButtons.deposit2'])}
                      type="number"
                      component={FormikInputField}
                      disabled={isSubmitting}
                    />

                    <Field
                      name="depositButtons.deposit3"
                      data-testid="FeatureForm-depositButtonsDeposit3Input"
                      className="FeatureForm__field FeatureForm__field--quick-deposit"
                      label={I18n.t(attributeLabels['depositButtons.deposit3'])}
                      type="number"
                      component={FormikInputField}
                      disabled={isSubmitting}
                    />

                    <Field
                      name="depositButtons.deposit4"
                      data-testid="FeatureForm-depositButtonsDeposit4Input"
                      className="FeatureForm__field FeatureForm__field--quick-deposit"
                      label={I18n.t(attributeLabels['depositButtons.deposit4'])}
                      type="number"
                      component={FormikInputField}
                      disabled={isSubmitting}
                    />

                    <Field
                      name="depositButtons.deposit5"
                      data-testid="FeatureForm-depositButtonsDeposit5Input"
                      className="FeatureForm__field FeatureForm__field--quick-deposit"
                      label={I18n.t(attributeLabels['depositButtons.deposit5'])}
                      type="number"
                      component={FormikInputField}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <If condition={!!platformMaxAccounts?.length}>
                  <div className="FeatureForm__block">
                    <span className="FeatureForm__block-title">
                      {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.ACCOUNT_QUANTITY.TITLE')}

                      <i className="FeatureForm__icon-info fa fa-info-circle" id={`quantity-${id}`} />

                      <UncontrolledTooltip
                        placement="right"
                        target={`quantity-${id}`}
                        delay={{ show: 0, hide: 0 }}
                        fade={false}
                      >
                        {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.ACCOUNT_QUANTITY.DESCRIPTION')}
                      </UncontrolledTooltip>
                    </span>

                    <div className="FeatureForm__account-fields">
                      {platformMaxAccounts?.map(({ platformType }) => (
                        <Field
                          key={platformType}
                          name={`platformMaxAccounts.${platformType}`}
                          data-testid={`FeatureForm-platformMaxAccounts${platformType}`}
                          className="FeatureForm__field FeatureForm__field--account"
                          label={`${platformType}.Account Quantity`}
                          type="number"
                          component={FormikInputField}
                          disabled={isSubmitting}
                        />
                      ))}
                    </div>
                  </div>
                </If>

                <div className="FeatureForm__block">
                  <span className="FeatureForm__block-title">
                    {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.HIDE_CHANGE_PASSWORD.TITLE')}

                    <i className="FeatureForm__icon-info fa fa-info-circle" id={`password-${id}`} />

                    <UncontrolledTooltip
                      placement="right"
                      target={`password-${id}`}
                      delay={{ show: 0, hide: 0 }}
                      fade={false}
                    >
                      {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.HIDE_CHANGE_PASSWORD.DESCRIPTION')}
                    </UncontrolledTooltip>
                  </span>

                  <Field
                    name="hideChangePasswordCp"
                    data-testid="FeatureForm-hideChangePasswordCheckbox"
                    className="FeatureForm__field-checkbox"
                    label={I18n.t(attributeLabels.hideChangePasswordCp)}
                    component={FormikCheckbox}
                  />
                </div>

                <div className="FeatureForm__block">
                  <span className="FeatureForm__block-title">
                    {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.AUTO_LOGOUT.TITLE')}

                    <i className="FeatureForm__icon-info fa fa-info-circle" id={`logout-${id}`} />

                    <UncontrolledTooltip
                      placement="right"
                      target={`logout-${id}`}
                      delay={{ show: 0, hide: 0 }}
                      fade={false}
                    >
                      {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.AUTO_LOGOUT.DESCRIPTION')}
                    </UncontrolledTooltip>
                  </span>

                  <Field
                    name="autoLogout"
                    data-testid="FeatureForm-autoLogoutCheckbox"
                    className="FeatureForm__field-checkbox"
                    label={I18n.t(attributeLabels.autoLogout)}
                    component={FormikCheckbox}
                  />

                  <Field
                    name="affiliateClientAutoLogoutMinutes"
                    data-testid="FeatureForm-affiliateClientAutoLogoutMinutesInput"
                    className="FeatureForm__field FeatureForm__field--time"
                    label={I18n.t(attributeLabels.affiliateClientAutoLogoutMinutes)}
                    type="number"
                    component={FormikInputField}
                    disabled={isSubmitting || !values.autoLogout}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default React.memo(FeatureForm);
