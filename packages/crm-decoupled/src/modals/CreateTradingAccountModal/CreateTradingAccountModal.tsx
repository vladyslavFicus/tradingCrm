import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Config, Utils, parseErrors, notify, Types } from '@crm/common';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import Modal from 'components/Modal';
import { attributeLabels, amounts } from './constants';
import {
  useCreateTradingAccountMutation,
  CreateTradingAccountMutationVariables,
} from './graphql/__generated__/CreateTradingAccountMutation';

type FormValues = {
  platformType: string,
  accountType: string,
  name: string,
  currency: string,
  amount: number,
  password: string | null,
};

export type Props = {
  profileId: string,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const TradingAccountAddModal = (props: Props) => {
  const { profileId, onSuccess, onCloseModal } = props;

  const platformTypes = Utils.getAvailablePlatformTypes();
  const platformType = platformTypes?.[0]?.value;

  const accountType = Utils.getAvailableAccountTypes(platformType)
    .find(type => type?.value === 'LIVE') ? 'LIVE' : 'DEMO';

  // ===== Requests ===== //
  const [createTradingAccountMutation] = useCreateTradingAccountMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    const variables = { ...values, profileId } as CreateTradingAccountMutationVariables;

    if (values.platformType === 'WET' || values.platformType === 'TE') {
      // Remove password field from request for WET and TE accounts
      variables.password = null;
    }

    try {
      await createTradingAccountMutation({ variables });

      onSuccess();
      onCloseModal();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.SUCCESSFULLY_CREATED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE'),
        message: I18n.t(error.error) || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  const handleChangePlatformType = (
    values: FormValues, value: string, setFieldValue: Types.SetFieldValue<FormValues>,
  ) => {
    const availableAccountTypes = Utils.getAvailableAccountTypes(value);

    // If previous accountType not found for new chosen platformType --> choose first from list
    if (!availableAccountTypes.find(type => type?.value === values.accountType)) {
      setFieldValue('accountType', availableAccountTypes?.[0]?.value);
    }

    setFieldValue('platformType', value);
    setFieldValue('currency', Utils.getPlatformDefaultCurrency(value));
  };

  return (
    <Formik
      initialValues={{
        platformType,
        accountType,
        name: '',
        currency: Utils.getPlatformDefaultCurrency(platformType),
        amount: 0,
        password: Utils.generate(),
      }}
      validate={values => Utils.createValidator({
        name: ['required', 'string', 'max:50', 'min:4'],
        currency: ['required', 'string'],
        password: values.platformType !== 'WET'
          && values.platformType !== 'TE'
          && ['required', `regex:${Config.getBrand().password.mt4_pattern}`],
        amount: values.accountType === 'DEMO' && 'required',
      }, Utils.translateLabels(attributeLabels), false)(values)}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue, values, submitForm }) => {
        const accountTypes = Utils.getAvailableAccountTypes(values.platformType);

        return (
          <Modal
            onCloseModal={onCloseModal}
            title={I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE')}
            disabled={isSubmitting}
            buttonTitle={I18n.t('COMMON.CONFIRM')}
            clickSubmit={submitForm}
          >
            <Form>
              <If condition={platformTypes.length > 1}>
                <Field
                  name="platformType"
                  data-testid="TradingAccountAddModal-platformTypeSelect"
                  component={FormikSelectField}
                  label={I18n.t(attributeLabels.platformType)}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  customOnChange={(value: string) => handleChangePlatformType(values, value, setFieldValue)}
                >
                  {platformTypes.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Field>
              </If>

              <If condition={accountTypes.length > 1}>
                <Field
                  name="accountType"
                  data-testid="TradingAccountAddModal-accountTypeSelect"
                  component={FormikSelectField}
                  label={attributeLabels.accountType}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                >
                  {accountTypes.map(({ value, label }) => (
                    <option key={value} value={value}>{I18n.t(label)}</option>
                  ))}
                </Field>
              </If>

              <Field
                name="name"
                type="text"
                data-testid="TradingAccountAddModal-nameInput"
                label={attributeLabels.name}
                component={FormikInputField}
                placeholder={attributeLabels.name}
              />

              <If condition={values.accountType === 'DEMO'}>
                <Field
                  name="amount"
                  data-testid="TradingAccountAddModal-amountSelect"
                  component={FormikSelectField}
                  label={attributeLabels.amount}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                >
                  {amounts.map(value => (
                    <option key={value} value={value}>
                      {I18n.toNumber(value, { precision: 0 })}
                    </option>
                  ))}
                </Field>
              </If>

              <Field
                name="currency"
                data-testid="TradingAccountAddModal-currencySelect"
                component={FormikSelectField}
                label={attributeLabels.currency}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              >
                {Utils.getPlarformSupportedCurrencies(values.platformType).map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Field>

              <If condition={values.platformType !== 'WET' && values.platformType !== 'TE'}>
                <Field
                  name="password"
                  data-testid="TradingAccountAddModal-passwordInput"
                  component={FormikInputField}
                  label={attributeLabels.password}
                  placeholder={attributeLabels.password}
                  addition={<span className="icon-generate-password" />}
                  onAdditionClick={() => setFieldValue('password', Utils.generate())}
                />
              </If>
            </Form>
          </Modal>
        );
      }}
    </Formik>
  );
};

export default React.memo(TradingAccountAddModal);
