import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikProps } from 'formik';
import { getBrand } from 'config';
import { notify } from 'providers/NotificationProvider';
import { LevelType } from 'types/notify';
import { PaymentDeposit } from '__generated__/types';
import { createValidator, translateLabels } from 'utils/validator';
import { Button } from 'components/Buttons';
import { FormikInputField, FormikSelectField } from 'components/Formik';
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

  const supportedCurrencies = getBrand().currencies.supported;
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
    <Modal
      className="UpdateDepositAmountModal"
      toggle={onCloseModal}
      isOpen
    >
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
        {({ dirty, isSubmitting }: FormikProps<PaymentDeposit>) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('FEATURE_TOGGLES.MODALS.UPDATE_DEPOSIT_AMOUNT.TITLE')}
            </ModalHeader>

            <ModalBody>
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
            </ModalBody>

            <ModalFooter>
              <Button
                data-testid="UpdateDepositAmountModal-cancelButton"
                onClick={onCloseModal}
                tertiary
              >
                {I18n.t('COMMON.CANCEL')}
              </Button>

              <Button
                data-testid="UpdateDepositAmountModal-saveButton"
                type="submit"
                disabled={!dirty || isSubmitting}
                primary
              >
                {I18n.t('COMMON.SAVE')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(UpdateDepositAmountModal);
