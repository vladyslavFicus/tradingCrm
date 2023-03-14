import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { parseErrors } from 'apollo';
import { getBrand } from 'config';
import { SetFieldValue } from 'types/formik';
import { notify, LevelType } from 'providers/NotificationProvider';
import { generate } from 'utils/password';
import { createValidator, translateLabels } from 'utils/validator';
import {
  getAvailablePlatformTypes,
  getAvailableAccountTypes,
  getPlarformSupportedCurrencies,
  getPlatformDefaultCurrency,
} from 'utils/tradingAccount';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { Button } from 'components/Buttons';
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

  const platformTypes = getAvailablePlatformTypes();
  const platformType = platformTypes?.[0]?.value;

  const accountType = getAvailableAccountTypes(platformType).find(type => type?.value === 'LIVE') ? 'LIVE' : 'DEMO';

  // ===== Requests ===== //
  const [createTradingAccountMutation] = useCreateTradingAccountMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    const variables = { ...values, profileId } as CreateTradingAccountMutationVariables;

    if (values.platformType === 'WET') {
      // Remove password field from request for WET accounts
      variables.password = null;
    }

    try {
      await createTradingAccountMutation({ variables });

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE'),
        message: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.SUCCESSFULLY_CREATED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE'),
        message: I18n.t(error.error) || I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  const handleChangePlatformType = (values: FormValues, value: string, setFieldValue: SetFieldValue<FormValues>) => {
    const availableAccountTypes = getAvailableAccountTypes(value);

    // If previous accountType not found for new chosen platformType --> choose first from list
    if (!availableAccountTypes.find(type => type?.value === values.accountType)) {
      setFieldValue('accountType', availableAccountTypes?.[0]?.value);
    }

    setFieldValue('platformType', value);
    setFieldValue('currency', getPlatformDefaultCurrency(value));
  };

  return (
    <Modal toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          platformType,
          accountType,
          name: '',
          currency: getPlatformDefaultCurrency(platformType),
          amount: 0,
          password: generate(),
        }}
        validate={values => createValidator({
          name: ['required', 'string', 'max:50', 'min:4'],
          currency: ['required', 'string'],
          password: values.platformType !== 'WET' && ['required', `regex:${getBrand().password.mt4_pattern}`],
          amount: values.accountType === 'DEMO' && 'required',
        }, translateLabels(attributeLabels), false)}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => {
          const accountTypes = getAvailableAccountTypes(values.platformType);

          return (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('CLIENT_PROFILE.ACCOUNTS.MODAL_CREATE.TITLE')}
              </ModalHeader>

              <ModalBody>
                <If condition={platformTypes.length > 1}>
                  <Field
                    name="platformType"
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
                  label={attributeLabels.name}
                  component={FormikInputField}
                  placeholder={attributeLabels.name}
                />

                <If condition={values.accountType === 'DEMO'}>
                  <Field
                    name="amount"
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
                  component={FormikSelectField}
                  label={attributeLabels.currency}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                >
                  {getPlarformSupportedCurrencies(values.platformType).map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>

                <If condition={values.platformType !== 'WET'}>
                  <Field
                    name="password"
                    component={FormikInputField}
                    label={attributeLabels.password}
                    placeholder={attributeLabels.password}
                    addition={<span className="icon-generate-password" />}
                    onAdditionClick={() => setFieldValue('password', generate())}
                  />
                </If>
              </ModalBody>

              <ModalFooter>
                <Button
                  tertiary
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.CANCEL')}
                </Button>

                <Button
                  type="submit"
                  primary
                  disabled={isSubmitting}
                >
                  {I18n.t('COMMON.CONFIRM')}
                </Button>
              </ModalFooter>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default React.memo(TradingAccountAddModal);
