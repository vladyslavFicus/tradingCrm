import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Button } from 'components';
import { permissions } from 'config';
import { parseErrors } from 'apollo';
import { accountTypesLabels } from 'constants/accountTypes';
import { usePermission } from 'providers/PermissionsProvider';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import Badge from 'components/Badge';
import Input from 'components/Input';
import ShortLoader from 'components/ShortLoader';
import enumToArray from 'utils/enumToArray';
import { createValidator } from 'utils/validator';
import EventEmitter, { TRANSACTION_CREATED } from 'utils/EventEmitter';
import { useAccountQuery } from './graphql/__generated__/AccountQuery';
import { useCreditInMutation } from './graphql/__generated__/CreditInMutation';
import { useCreditOutMutation } from './graphql/__generated__/CreditOutMutation';
import { useCorrectionInMutation } from './graphql/__generated__/CorrectionInMutation';
import { useCorrectionOutMutation } from './graphql/__generated__/CorrectionOutMutation';
import './FixBalanceModal.scss';

enum BalanceOperationEnum {
  CORRECTION_IN = 'CORRECTION_IN',
  CORRECTION_OUT = 'CORRECTION_OUT',
  CREDIT_IN = 'CREDIT_IN',
  CREDIT_OUT = 'CREDIT_OUT',
}

type FormValues = {
  operation: BalanceOperationEnum,
  amount: number | null,
}

export type Props = {
  onCloseModal: () => void,
  login: string,
}

const FixBalanceModal = (props: Props) => {
  const {
    onCloseModal,
    login,
  } = props;

  const permission = usePermission();

  const accountQuery = useAccountQuery({
    variables: { identifier: login },
    fetchPolicy: 'network-only',
  });

  const [creditIn] = useCreditInMutation();
  const [creditOut] = useCreditOutMutation();
  const [correctionIn] = useCorrectionInMutation();
  const [correctionOut] = useCorrectionOutMutation();

  const account = accountQuery.data?.tradingEngine.account;

  const allowedOperations = enumToArray(BalanceOperationEnum)
    .filter(operation => permission.allows(permissions.WE_TRADING[operation]));

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    try {
      switch (values.operation) {
        /* ===== CREDIT IN ===== */
        case BalanceOperationEnum.CREDIT_IN:
          await creditIn({
            variables: {
              accountUuid: account?.uuid as string,
              amount: values.amount as number,
            },
          });
          break;

        /* ===== CREDIT OUT ===== */
        case BalanceOperationEnum.CREDIT_OUT:
          await creditOut({
            variables: {
              accountUuid: account?.uuid as string,
              amount: values.amount as number,
            },
          });
          break;

        /* ===== CORRECTION IN ===== */
        case BalanceOperationEnum.CORRECTION_IN:
          await correctionIn({
            variables: {
              accountUuid: account?.uuid as string,
              amount: values.amount as number,
            },
          });
          break;

        /* ===== CORRECTION OUT ===== */
        case BalanceOperationEnum.CORRECTION_OUT:
          await correctionOut({
            variables: {
              accountUuid: account?.uuid as string,
              amount: values.amount as number,
            },
          });
          break;
        default:
          break;
      }

      EventEmitter.emit(TRANSACTION_CREATED);

      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);

      // If insufficient credit
      if (error.error === 'error.credit.not-enough-credit') {
        formikHelpers.setFieldError(
          'amount',
          I18n.t('TRADING_ENGINE.MODALS.FIX_ORDER_MODAL.ERRORS.ENTER_CORRECT_AMOUNT'),
        );
      }

      // If insufficient balance
      if (error.error === 'error.balance.not-enough-balance') {
        formikHelpers.setFieldError(
          'amount',
          I18n.t('TRADING_ENGINE.MODALS.FIX_ORDER_MODAL.ERRORS.ENTER_CORRECT_AMOUNT'),
        );
      }
    }
  };

  return (
    <Modal className="FixBalanceModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          operation: allowedOperations[0], // Pre-select first allowed operation
          amount: null,
        } as FormValues}
        validate={createValidator({
          operation: 'required|string',
          amount: ['required', 'numeric', 'min:0.01', 'max:1000000'],
        }, {
          amount: I18n.t('TRADING_ENGINE.MODALS.FIX_ORDER_MODAL.AMOUNT'),
        })}
        onSubmit={handleSubmit}
      >
        {({ dirty, isValid, isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('TRADING_ENGINE.MODALS.FIX_ORDER_MODAL.TITLE')}
            </ModalHeader>
            <ModalBody>
              <div className="FixBalanceModal__inner-wrapper">
                <div className="FixBalanceModal__form">
                  <Choose>
                    <When condition={accountQuery.loading}>
                      <div className="FixBalanceModal__field-container">
                        <div className="FixBalanceModal__account FixBalanceModal__account--loader">
                          <ShortLoader height={22} />
                        </div>
                      </div>
                    </When>
                    <When condition={!!account}>
                      <div className="FixBalanceModal__field-container">
                        <div className="FixBalanceModal__account">
                          <div>
                            <Badge
                              text={I18n.t(accountTypesLabels[account?.accountType as string].label)}
                              info={account?.accountType === 'DEMO'}
                              success={account?.accountType === 'LIVE'}
                            >
                              <span className="FixBalanceModal__account-label">
                                {I18n.t('TRADING_ENGINE.MODALS.FIX_ORDER_MODAL.ACCOUNT.NAME')}:
                              </span>
                              &nbsp;{account?.name}
                            </Badge>
                            <div>
                              <span className="FixBalanceModal__account-label">
                                {I18n.t('TRADING_ENGINE.MODALS.FIX_ORDER_MODAL.ACCOUNT.GROUP')}:
                              </span>
                              &nbsp;{account?.group}
                            </div>
                          </div>
                          <div>
                            <div>
                              <span className="FixBalanceModal__account-label">
                                {I18n.t('TRADING_ENGINE.MODALS.FIX_ORDER_MODAL.ACCOUNT.BALANCE')}:
                              </span>
                              &nbsp;{I18n.toCurrency(account?.balance || 0, { unit: '' })}
                            </div>
                            <div>
                              <span className="FixBalanceModal__account-label">
                                {I18n.t('TRADING_ENGINE.MODALS.FIX_ORDER_MODAL.ACCOUNT.CREDIT')}:
                              </span>
                              &nbsp;{I18n.toCurrency(account?.credit || 0, { unit: '' })}
                            </div>
                            <div>
                              <span className="FixBalanceModal__account-label">
                                {I18n.t('TRADING_ENGINE.MODALS.FIX_ORDER_MODAL.ACCOUNT.FREE_MARGIN')}:
                              </span>
                              &nbsp;{I18n.toCurrency(account?.statistic.freeMargin || 0, { unit: '' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </When>
                  </Choose>

                  <div className="FixBalanceModal__field-container">
                    <Input
                      disabled
                      name="login"
                      data-testid="FixBalanceModal-loginInput"
                      label={I18n.t('TRADING_ENGINE.MODALS.FIX_ORDER_MODAL.LOGIN')}
                      value={login}
                      className="FixBalanceModal__field"
                    />
                  </div>

                  <div className="FixBalanceModal__field-container">
                    <Field
                      name="operation"
                      data-testid="FixBalanceModal-operationSelect"
                      label={I18n.t('TRADING_ENGINE.MODALS.FIX_ORDER_MODAL.OPERATION')}
                      className="FixBalanceModal__field"
                      disabled={accountQuery.loading}
                      component={FormikSelectField}
                    >
                      {allowedOperations.map(operation => (
                        <option key={operation} value={operation}>
                          {I18n.t(`TRADING_ENGINE.MODALS.FIX_ORDER_MODAL.OPERATIONS.${operation}`)}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="FixBalanceModal__field-container">
                    <Field
                      name="amount"
                      type="number"
                      data-testid="FixBalanceModal-amountInput"
                      label={I18n.t('TRADING_ENGINE.MODALS.FIX_ORDER_MODAL.AMOUNT')}
                      placeholder="0.00"
                      step="0.01"
                      min={0}
                      max={1000000}
                      component={FormikInputField}
                      className="FixBalanceModal__field"
                      disabled={accountQuery.loading}
                    />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                tertiary
                onClick={onCloseModal}
                data-testid="FixBalanceModal-cancelButton"
              >
                {I18n.t('COMMON.CANCEL')}
              </Button>
              <Button
                primary
                type="submit"
                disabled={!isValid || !dirty || isSubmitting}
                data-testid="FixBalanceModal-confirmButton"
              >
                {I18n.t('COMMON.BUTTONS.CONFIRM')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(FixBalanceModal);
