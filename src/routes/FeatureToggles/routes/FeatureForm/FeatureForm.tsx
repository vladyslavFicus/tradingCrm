import React from 'react';
import { Field, Form, Formik } from 'formik';
import I18n from 'i18n-js';
import { v4 } from 'uuid';
import { LevelType } from 'types';
import { parseErrors } from 'apollo';
import { PaymentDeposit, PlatformType__Enum as PlatformType } from '__generated__/types';
import countryList from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import { Button } from 'components/Buttons';
import { FormikCheckbox, FormikInputField, FormikSelectField } from 'components/Formik';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import Tabs from 'components/Tabs';
import { featureTabs } from 'routes/FeatureToggles/constants';
import { notify } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import DepositeGrid from './components/DepositGrid';
import { attributeLabels, customErrors } from './constants';
import { useBrandConfigQuery } from './graphql/__generated__/BrandConfigQuery';
import { useUpdateBrandConfigMutation } from './graphql/__generated__/UpdateBrandConfigMutation';
import './FeatureForm.scss';

type FormValues = {
  autoLogout: boolean,
  depositButtons: {
    deposit1: number,
    deposit2: number,
    deposit3: number,
    deposit4: number | null,
    deposit5: number | null,
  },
  restrictedCountries: Array<string>,
  paymentAmounts: Array<number>,
  profileDepositEnable: boolean,
  notificationCleanUpDays: number,
  hideChangePasswordCp: boolean,
  referralEnable: boolean,
  jwtAccessTtlSeconds: number,
  platformMaxAccounts: Record<PlatformType, number>,
  paymentDeposits: Array<PaymentDeposit>,
  accountAutoCreations: Record<string, boolean>,
};

const FeatureForm = () => {
  const id = v4();

  // ===== Requests ===== //
  const { data, refetch } = useBrandConfigQuery();
  const brandConfig = data?.featureToggles;

  const [updateBrandConfigMutation] = useUpdateBrandConfigMutation();

  const {
    restrictedCountries,
    paymentAmounts,
    profileDepositEnable,
    notificationCleanUpDays,
    hideChangePasswordCp,
    referralEnable,
    jwtAccessTtlSeconds,
    platformMaxAccounts,
    paymentDeposits,
    accountAutoCreations,
    version,
  } = brandConfig || {};

  // ===== Modals ===== //
  const confirmUpdateVersionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    const { depositButtons, platformMaxAccounts: updatedPlatform, accountAutoCreations: updatedAccounts } = values;
    const depositAmounts = Object.values(depositButtons).filter(deposit => deposit !== null);

    const newPlatformMaxAccounts = platformMaxAccounts?.map((platform) => {
      const updatedMaxLiveAccounts = updatedPlatform[platform?.platformType as PlatformType];

      return { platformType: platform?.platformType as PlatformType, maxLiveAccounts: updatedMaxLiveAccounts };
    });

    const updatedAccountAutoCreations = Object.entries(updatedAccounts).map(([key, value]) => {
      const [platformType, accountCurrency] = key.split('-');

      return {
        accountCurrency,
        createOnRegistration: value,
        platformType: platformType as PlatformType,
      };
    });

    try {
      await updateBrandConfigMutation({
        variables: {
          restrictedCountries: values?.restrictedCountries,
          version: version || 0,
          paymentAmounts: depositAmounts as Array<number>,
          profileDepositEnable: !!values?.profileDepositEnable,
          hideChangePasswordCp: values?.hideChangePasswordCp,
          referralEnable: values?.referralEnable,
          notificationCleanUpDays: values?.notificationCleanUpDays || 0,
          jwtAccessTtlSeconds: values?.jwtAccessTtlSeconds || null,
          platformMaxAccounts: newPlatformMaxAccounts || [],
          paymentDeposits: values?.paymentDeposits || [],
          accountAutoCreations: updatedAccountAutoCreations || [],
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('FEATURE_TOGGLES.FEATURE_FORM.SUBMIT.SUCCESS'),
        message: I18n.t('FEATURE_TOGGLES.FEATURE_FORM.SUBMIT.SUCCESS'),
      });
    } catch (e: any) {
      const error = parseErrors(e);

      if (error.error === 'error.entity.version.conflict') {
        confirmUpdateVersionModal.show({
          modalTitle: I18n.t('FEATURE_TOGGLES.MODALS.UPDATE_VERSION_MODAL.TITLE'),
          actionText: I18n.t('FEATURE_TOGGLES.MODALS.UPDATE_VERSION_MODAL.TEXT'),
          submitButtonLabel: I18n.t('COMMON.BUTTONS.UPDATE_NOW'),
          onSubmit: async () => {
            await refetch();
          },
        });
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('FEATURE_TOGGLES.FEATURE_FORM.SUBMIT.ERROR'),
        });
      }
    }
  };

  const initialAccountAutoCreations = accountAutoCreations?.reduce((acc, account) => (
    { ...acc, [`${account?.platformType}-${account?.accountCurrency}`]: account?.createOnRegistration }),
  {});

  const initialPlatformMaxAccounts = platformMaxAccounts?.reduce((acc, platformAcc) => (
    { ...acc, [platformAcc?.platformType]: platformAcc?.maxLiveAccounts }), {});

  return (
    <>
      <Tabs items={featureTabs} className="FeatureForm__tabs" />

      <div className="FeatureForm">
        <Formik
          initialValues={{
            jwtAccessTtlSeconds: jwtAccessTtlSeconds || '',
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
            autoLogout: !!jwtAccessTtlSeconds,
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
              deposit4: 'numeric',
              deposit5: 'numeric',
            },
            referralEnable: 'boolean',
            accountAutoCreations: accountAutoCreations?.reduce((acc, account) => (
              { ...acc,
                [`${account?.platformType}-${account?.accountCurrency}`]: 'boolean' }),
            {}),
            profileDepositEnable: 'boolean',
            hideChangePasswordCp: 'boolean',
            autoLogout: 'boolean',
            jwtAccessTtlSeconds: ['required_with:autoLogout', 'numeric', 'greater:0'],
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

                    {accountAutoCreations?.map(account => (
                      <Field
                        key={`${account?.platformType}-${account?.accountCurrency}`}
                        name={`accountAutoCreations.${account?.platformType}-${account?.accountCurrency}`}
                        className="FeatureForm__field-checkbox FeatureForm__field-checkbox--multi"
                        label={`${account?.platformType}-${account?.accountCurrency}`}
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
                      className="FeatureForm__field FeatureForm__field--quick-deposit"
                      label={I18n.t(attributeLabels['depositButtons.deposit1'])}
                      type="number"
                      component={FormikInputField}
                      disabled={isSubmitting}
                    />

                    <Field
                      name="depositButtons.deposit2"
                      className="FeatureForm__field FeatureForm__field--quick-deposit"
                      label={I18n.t(attributeLabels['depositButtons.deposit2'])}
                      type="number"
                      component={FormikInputField}
                      disabled={isSubmitting}
                    />

                    <Field
                      name="depositButtons.deposit3"
                      className="FeatureForm__field FeatureForm__field--quick-deposit"
                      label={I18n.t(attributeLabels['depositButtons.deposit3'])}
                      type="number"
                      component={FormikInputField}
                      disabled={isSubmitting}
                    />

                    <Field
                      name="depositButtons.deposit4"
                      className="FeatureForm__field FeatureForm__field--quick-deposit"
                      label={I18n.t(attributeLabels['depositButtons.deposit4'])}
                      type="number"
                      component={FormikInputField}
                      disabled={isSubmitting}
                    />

                    <Field
                      name="depositButtons.deposit5"
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
                      {platformMaxAccounts?.map(platform => (
                        <Field
                          name={`platformMaxAccounts.${platform?.platformType}`}
                          className="FeatureForm__field FeatureForm__field--account"
                          label={`${platform?.platformType}.Account Quantity`}
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
                    {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.CHANGE_PASSWORD.TITLE')}

                    <i className="FeatureForm__icon-info fa fa-info-circle" id={`password-${id}`} />

                    <UncontrolledTooltip
                      placement="right"
                      target={`password-${id}`}
                      delay={{ show: 0, hide: 0 }}
                      fade={false}
                    >
                      {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.CHANGE_PASSWORD.DESCRIPTION')}
                    </UncontrolledTooltip>
                  </span>

                  <Field
                    name="hideChangePasswordCp"
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
                    className="FeatureForm__field-checkbox"
                    label={I18n.t(attributeLabels.autoLogout)}
                    component={FormikCheckbox}
                  />

                  <Field
                    name="jwtAccessTtlSeconds"
                    className="FeatureForm__field FeatureForm__field--time"
                    label={I18n.t(attributeLabels.jwtAccessTtlSeconds)}
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
