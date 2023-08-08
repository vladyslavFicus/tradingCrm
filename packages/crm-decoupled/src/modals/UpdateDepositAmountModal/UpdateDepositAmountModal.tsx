import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikProps } from 'formik';
import { Config } from '@crm/common';
import { notify } from 'providers/NotificationProvider';
import { LevelType } from 'types/notify';
import { PaymentDeposit } from '__generated__/types';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import Modal from 'components/Modal';
import { attributeLabels } from './constants';

export type Props = {
  currencies?: Array<string>,
  depositAmount?: PaymentDeposit,
  onCloseModal: () => void,
  onSuccess: (depositAmount: PaymentDeposit) => void,
};

const UpdateDepositAmountModal = (props: Props) => {
  const {
    currencies,
    depositAmount,
    onCloseModal,
    onSuccess,
  } = props;

  const supportedCurrencies = Config.getBrand().currencies.supported;
  const freeCurrencies = supportedCurrencies.filter((currency: string) => !currencies?.includes(currency));

  const handleSubmit = (updatedDepositAmount: PaymentDeposit) => {
    notify({
      level: LevelType.SUCCESS,
      title: I18n.t('FEATURE_TOGGLES.MODALS.UPDATE_DEPOSIT_AMOUNT.TITLE'),
      message: I18n.t('FEATURE_TOGGLES.MODALS.UPDATE_DEPOSIT_AMOUNT.NOTIFICATION.SUCCESS'),
    });

    onSuccess(updatedDepositAmount);
    onCloseModal();
  };

  return (
    <Formik
      initialValues={{
        currency: depositAmount?.currency || '',
        min: depositAmount?.min || '',
        max: depositAmount?.max || '',
      } as PaymentDeposit}
      validate={createValidator({
        currency: ['required', 'string'],
        min: ['required', 'numeric', 'greater:0'],
        max: ['required', 'numeric', 'greaterThan:min'],
      }, translateLabels(attributeLabels), false)}
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ dirty, isSubmitting, submitForm }: FormikProps<PaymentDeposit>) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('FEATURE_TOGGLES.MODALS.UPDATE_DEPOSIT_AMOUNT.TITLE')}
          buttonTitle={I18n.t('COMMON.SAVE')}
          disabled={!dirty || isSubmitting}
          clickSubmit={submitForm}
        >
          <Form>
            <div className="UpdateDepositAmountModal__fields">
              <Field
                name="currency"
                data-testid="UpdateDepositAmountModal-currencySelect"
                label={I18n.t('FEATURE_TOGGLES.MODALS.UPDATE_DEPOSIT_AMOUNT.CURRENCY')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                className="UpdateDepositAmountModal__field--large"
                component={FormikSelectField}
                disabled={!currencies}
              >
                {(currencies ? freeCurrencies : supportedCurrencies).map((currency: string) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </Field>

              <Field
                name="min"
                data-testid="UpdateDepositAmountModal-minInput"
                label={I18n.t('FEATURE_TOGGLES.MODALS.UPDATE_DEPOSIT_AMOUNT.MIN_DEPOSIT')}
                className="UpdateDepositAmountModal__field"
                component={FormikInputField}
                type="number"
                disabled={isSubmitting}
              />

              <Field
                name="max"
                data-testid="UpdateDepositAmountModal-maxInput"
                label={I18n.t('FEATURE_TOGGLES.MODALS.UPDATE_DEPOSIT_AMOUNT.MAX_DEPOSIT')}
                className="UpdateDepositAmountModal__field"
                component={FormikInputField}
                type="number"
                disabled={isSubmitting}
              />
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(UpdateDepositAmountModal);
