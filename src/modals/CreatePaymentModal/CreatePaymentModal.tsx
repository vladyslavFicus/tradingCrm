import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { parseErrors } from 'apollo';
import { EditNote } from 'types/Note';
import { PaymentMutationCreatePaymentArgs as PaymentValues, Profile, TradingAccount } from '__generated__/types';
import { notify, LevelType } from 'providers/NotificationProvider';
import { usePermission } from 'providers/PermissionsProvider';
import { targetTypes } from 'constants/note';
import { manualPaymentMethods, manualPaymentMethodsLabels } from 'constants/payment';
import { Button } from 'components/Buttons';
import NoteActionManual from 'components/Note/NoteActionManual';
import { FormikInputField, FormikSelectField, FormikDatePicker } from 'components/Formik';
import Currency from 'components/Currency';
import AccountsSelectField from './components/AccountsSelectField';
import { validation } from './utils';
import { paymentTypes, paymentTypesLabels, attributeLabels } from './constants';
import { useManualPaymentMethodsQuery } from './graphql/__generated__/ManualPaymentMethodsQuery';
import { usePaymentSystemQuery } from './graphql/__generated__/PaymentSystemsQuery';
import { useAddNoteMutation } from './graphql/__generated__/AddNoteMutation';
import {
  CreatePaymentMutationVariables,
  useCreatePaymentMutation,
} from './graphql/__generated__/CreatePaymentMutation';
import './CreatePaymentModal.scss';

export type Props = {
  profile: Profile,
  onCloseModal: () => void,
  onSuccess: () => void,
};

type WithPaymentSystemName = {
  paymentSystemName: string | undefined,
};

type SubmitValues = PaymentValues & WithPaymentSystemName;

const CreatePaymentModal = (props: Props) => {
  const {
    profile: {
      uuid,
      tradingAccounts,
    },
    onCloseModal,
    onSuccess,
  } = props;

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [note, setNote] = useState<EditNote | null>(null);

  const permission = usePermission();

  // ===== Requests ===== //
  const { data: manualPaymentMethodsData, loading: manualMethodsLoading } = useManualPaymentMethodsQuery();
  const { data: paymentSystemsData, loading: paymentSystemsLoading } = usePaymentSystemQuery();

  const [createPaymentMutation] = useCreatePaymentMutation();
  const [addNoteMutation] = useAddNoteMutation();

  const getNote = (editNote: EditNote | null) => {
    setNote(editNote);
  };

  const resetErrorMessage = () => {
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const resolvePaymentSystemValue = (paymentSystem: string, paymentSystemName: string): string => {
    const isOtherPaymentSystem = paymentSystem === 'OTHER';
    
    return isOtherPaymentSystem ? `Other (${paymentSystemName})` : paymentSystem;
  };

  const onSubmit = async (data: SubmitValues) => {
    const variables = {
      ...data as CreatePaymentMutationVariables,
      paymentSystem: resolvePaymentSystemValue(data.paymentSystem || '', data.paymentSystemName || ''),
      profileUUID: uuid,
    };

    try {
      const { data: dataPayment } = await createPaymentMutation({ variables });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('PLAYER_PROFILE.TRANSACTIONS.ADD_TRANSACTION_SUCCESS'),
      });

      if (note) {
        await addNoteMutation({
          variables: {
            ...note,
            targetUUID: dataPayment?.payment.createPayment?.paymentId as string,
          },
        });
      }

      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);

      const {
        code,
        defaultMessage,
      } = error.errors[0] || {};

      if (defaultMessage === 'error.validation.invalid.amount' && code) {
        setErrorMessage(I18n.t(`error.validation.invalid.amount.${code}`));

        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t(`error.validation.invalid.amount.${code}`),
        });

        return;
      }

      setErrorMessage(error.message);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: error.message || I18n.t('PLAYER_PROFILE.TRANSACTIONS.ADD_TRANSACTION_FAIL'),
      });
    }
  };

  const getSourceAccount = ({ accountUUID, source }: PaymentValues) => tradingAccounts
    ?.find(account => [accountUUID, source].includes(account?.accountUUID));

  const handlePaymentTypeChanged = (value: PaymentValues,
    {
      setFieldValue,
      resetForm,
    }: FormikHelpers<PaymentValues>) => {
    resetErrorMessage();
    resetForm();
    setFieldValue('paymentType', value);
  };

  const isValidTransaction = ({
    paymentType,
    accountUUID,
    amount,
  }: PaymentValues) => {
    if ([paymentTypes.WITHDRAW.name, paymentTypes.COMMISSION.name]
      .includes(paymentType) && accountUUID && amount && tradingAccounts?.length) {
      const tradingAccount = tradingAccounts.find(account => account?.accountUUID === accountUUID);

      return tradingAccount?.balance as number >= amount;
    }

    if (paymentType === 'CREDIT_OUT' && accountUUID && amount && tradingAccounts?.length) {
      const tradingAccount = tradingAccounts.find(account => account?.accountUUID === accountUUID);

      return tradingAccount?.credit as number >= amount;
    }

    return true;
  };

  const manualMethods = manualPaymentMethodsData?.manualPaymentMethods || [];
  const paymentSystems = paymentSystemsData?.paymentSystems || [];

  return (
    <Modal contentClassName="CreatePaymentModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{} as SubmitValues}
        validate={values => validation(values, tradingAccounts as Array<TradingAccount>)}
        onSubmit={onSubmit}
      >
        {({
          isSubmitting,
          dirty,
          isValid,
          values,
          values: { paymentType, paymentSystem },
          setFieldValue,
          resetForm,
        }) => {
          const sourceAccount = getSourceAccount(values as PaymentValues);
          const paymentMethods = paymentType === paymentTypes.CREDIT_IN.name
            ? ['REFERRAL_BONUS', 'INTERNAL_TRANSFER']
            : manualMethods;

          const isPaymentSystemVisible = paymentType === 'DEPOSIT'
            && ['CHARGEBACK', 'CREDIT_CARD', 'RECALL', 'WIRE'].includes(values?.paymentMethod as string);

          const isPaymentSystemNameVisible = isPaymentSystemVisible && paymentSystem === 'OTHER';

          return (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.TITLE')}
              </ModalHeader>

              <ModalBody>
                <If condition={!!errorMessage}>
                  <span className="CreatePaymentModal__error-message">{errorMessage}</span>
                </If>

                <Field
                  name="paymentType"
                  label={attributeLabels.paymentType}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                  component={FormikSelectField}
                  customOnChange={(value: PaymentValues) => (
                    handlePaymentTypeChanged(value, {
                      setFieldValue,
                      resetForm,
                    } as FormikHelpers<PaymentValues>)
                  )}
                  showErrorMessage={false}
                >
                  {Object
                    .values(paymentTypes)
                    .filter(type => permission.allows(type.permission))
                    .map(({ name }) => (
                      <option key={name} value={name}>
                        {I18n.t(paymentTypesLabels[name])}
                      </option>
                    ))}
                </Field>

                <If condition={!!paymentType}>
                  <>
                    <div className="CreatePaymentModal__row CreatePaymentModal__row--field">
                      <Choose>
                        <When
                          condition={[paymentTypes.DEPOSIT.name, paymentTypes.CREDIT_IN.name].includes(paymentType)}
                        >
                          <Field
                            name="paymentMethod"
                            label={attributeLabels.paymentMethod}
                            className="CreatePaymentModal__field"
                            placeholder={I18n.t(
                              'PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.CHOOSE_PAYMENT_METHOD_LABEL',
                            )}
                            disabled={manualMethodsLoading}
                            component={FormikSelectField}
                            showErrorMessage={false}
                          >
                            {paymentMethods.map(item => (
                              <option key={item} value={item as string}>
                                {manualPaymentMethodsLabels[item as manualPaymentMethods]
                                  ? I18n.t(manualPaymentMethodsLabels[item as manualPaymentMethods])
                                  : item
                                }
                              </option>
                            ))}
                          </Field>

                          <div className="CreatePaymentModal__direction-icon">
                            <i className="icon-arrow-down" />
                          </div>

                          <AccountsSelectField
                            className="CreatePaymentModal__field"
                            name="accountUUID"
                            label="toAcc"
                            values={values}
                            tradingAccounts={tradingAccounts as Array<TradingAccount>}
                          />
                        </When>

                        <When condition={paymentType === paymentTypes.WITHDRAW.name}>
                          <AccountsSelectField
                            className="CreatePaymentModal__field"
                            name="accountUUID"
                            label="fromAcc"
                            values={values}
                            tradingAccounts={tradingAccounts as Array<TradingAccount>}
                          />
                        </When>

                        <When condition={paymentType === paymentTypes.TRANSFER.name}>
                          <AccountsSelectField
                            className="CreatePaymentModal__field"
                            name="source"
                            label="fromAcc"
                            values={values}
                            tradingAccounts={tradingAccounts as Array<TradingAccount>}
                          />

                          <div className="CreatePaymentModal__direction-icon">
                            <i className="icon-arrow-down" />
                          </div>

                          <AccountsSelectField
                            className="CreatePaymentModal__field"
                            name="target"
                            label="toAcc"
                            values={values}
                            tradingAccounts={tradingAccounts as Array<TradingAccount>}
                          />
                        </When>

                        <When condition={paymentType === paymentTypes.CREDIT_IN.name}>
                          <AccountsSelectField
                            className="CreatePaymentModal__field"
                            name="accountUUID"
                            label="toAcc"
                            values={values}
                            tradingAccounts={tradingAccounts as Array<TradingAccount>}
                          />
                        </When>

                        <When
                          condition={[paymentTypes.CREDIT_OUT.name, paymentTypes.COMMISSION.name].includes(paymentType)}
                        >
                          <AccountsSelectField
                            className="CreatePaymentModal__field"
                            name="accountUUID"
                            label="fromAcc"
                            values={values}
                            tradingAccounts={tradingAccounts as Array<TradingAccount>}
                          />
                        </When>
                      </Choose>
                    </div>

                    <If condition={isPaymentSystemVisible}>
                      <div className="CreatePaymentModal__row">
                        <Field
                          name="paymentSystem"
                          label={attributeLabels.paymentSystem}
                          placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                          className="CreatePaymentModal__field"
                          component={FormikSelectField}
                          disabled={paymentSystemsLoading}
                        >
                          {[
                            <option key="NONE" value="NONE">{I18n.t('COMMON.NONE')}</option>,
                            ...paymentSystems.map(({ paymentSystem: system }) => (
                              <option key={system} value={system}>
                                {system}
                              </option>
                            )),
                            <option key="OTHER" value="OTHER">{I18n.t('COMMON.OTHER')}</option>,
                          ]}
                        </Field>
                      </div>
                    </If>

                    <If condition={isPaymentSystemNameVisible}>
                      <div className="CreatePaymentModal__row">
                        <Field
                          name="paymentSystemName"
                          label={attributeLabels.paymentSystemName}
                          className="CreatePaymentModal__field"
                          component={FormikInputField}
                          disabled={paymentSystemsLoading}
                        />
                      </div>
                    </If>

                    <div className="CreatePaymentModal__row">
                      <Field
                        name="amount"
                        type="number"
                        label={attributeLabels.amount}
                        className="CreatePaymentModal__field CreatePaymentModal__field--small"
                        placeholder="0.00"
                        step="0.01"
                        min={0}
                        max={999999}
                        addition={sourceAccount && <Currency code={sourceAccount.currency as string} />}
                        component={FormikInputField}
                        showErrorMessage={false}
                      />

                      <If condition={paymentType === paymentTypes.DEPOSIT.name}>
                        <Field
                          name="externalReference"
                          type="text"
                          label={attributeLabels.externalReference}
                          className="CreatePaymentModal__field"
                          component={FormikInputField}
                          showErrorMessage={false}
                        />
                      </If>

                      <If condition={paymentType === paymentTypes.CREDIT_IN.name}>
                        <Field
                          name="expirationDate"
                          label={attributeLabels.expirationDate}
                          className="CreatePaymentModal__field"
                          component={FormikDatePicker}
                          showErrorMessage={false}
                          withTime
                          withUtc
                        />
                      </If>
                    </div>

                    <div className="CreatePaymentModal__row CreatePaymentModal__row--note">
                      <NoteActionManual
                        note={note}
                        playerUUID={uuid}
                        targetUUID={uuid}
                        targetType={targetTypes.PAYMENT}
                        onEditSuccess={getNote}
                        onDeleteSuccess={() => getNote(null)}
                        placement="bottom"
                      />
                    </div>
                  </>
                </If>
              </ModalBody>

              <ModalFooter className="CreatePaymentModal__footer">
                <div className="CreatePaymentModal__footer-message">
                  <strong>
                    {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.ATTENTION_UNDONE_ACTION_LABEL')}
                  </strong>
                  {': '}
                  {I18n.t('PLAYER_PROFILE.TRANSACTIONS.MODAL_CREATE.ATTENTION_UNDONE_ACTION')}
                </div>

                <div className="CreatePaymentModal__buttons">
                  <Button
                    className="CreatePaymentModal__button"
                    onClick={onCloseModal}
                    tertiary
                  >
                    {I18n.t('COMMON.CANCEL')}
                  </Button>

                  <Button
                    className="CreatePaymentModal__button"
                    disabled={!dirty || isSubmitting || !isValid || !isValidTransaction(values)}
                    type="submit"
                    primary
                  >
                    {I18n.t('COMMON.CONFIRM')}
                  </Button>
                </div>
              </ModalFooter>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default React.memo(CreatePaymentModal);
