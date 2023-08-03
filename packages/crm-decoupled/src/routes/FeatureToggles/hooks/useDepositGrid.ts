import { useEffect, useState, useCallback } from 'react';
import I18n from 'i18n-js';
import { v4 } from 'uuid';
import { useModal } from 'providers/ModalProvider';
import { PaymentDeposit } from '__generated__/types';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import UpdateDepositAmountModal,
{ UpdateDepositAmountModalProps } from 'modals/UpdateDepositAmountModal';

type Props = {
  depositAmounts: Array<PaymentDeposit>,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
};

const useDepositGrid = (props: Props) => {
  const { depositAmounts, setFieldValue } = props;

  const [depositCurrencies, setDepositCurrencies] = useState<Array<PaymentDeposit>>([]);

  useEffect(() => {
    setDepositCurrencies(depositAmounts);
  }, [depositAmounts]);

  const indicator = v4();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const updateDepositAmountModal = useModal<UpdateDepositAmountModalProps>(UpdateDepositAmountModal);

  const handleNewDepositAmount = useCallback((newCurrency: PaymentDeposit) => {
    const newDepositAmounts = [...depositCurrencies, newCurrency];

    setDepositCurrencies(newDepositAmounts);
    setFieldValue('paymentDeposits', newDepositAmounts);
  }, [depositCurrencies]);

  const handleEditDepositAmount = useCallback((depositAmount: PaymentDeposit) => {
    const modifiedDepositAmount = depositCurrencies.map(_depositAmount => (
      _depositAmount.currency === depositAmount.currency
        ? depositAmount
        : _depositAmount
    ));

    setDepositCurrencies(modifiedDepositAmount);
    setFieldValue('paymentDeposits', modifiedDepositAmount);
  }, [depositCurrencies]);

  const handleDeleteDepositAmount = useCallback((currency: string) => {
    const modifiedDepositAmount = depositCurrencies.filter(deposit => deposit.currency !== currency);

    setDepositCurrencies(modifiedDepositAmount);
    setFieldValue('paymentDeposits', modifiedDepositAmount);

    confirmActionModal.hide();
  }, [depositCurrencies]);

  const addNewDepositAmount = useCallback(() => {
    const currencies = depositCurrencies.map(deposit => deposit.currency);

    updateDepositAmountModal.show({
      onSuccess: handleNewDepositAmount,
      currencies,
    });
  }, [depositCurrencies]);

  const editDepositAmount = useCallback((depositAmount: PaymentDeposit) => {
    updateDepositAmountModal.show({
      depositAmount,
      onSuccess: handleEditDepositAmount,
    });
  }, []);

  const deleteDepositAmount = useCallback(({ currency }: PaymentDeposit) => {
    confirmActionModal.show({
      onSubmit: () => handleDeleteDepositAmount(currency),
      modalTitle: I18n.t('FEATURE_TOGGLES.FEATURE_FORM.TABLE.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('FEATURE_TOGGLES.FEATURE_FORM.TABLE.CONFIRMATION.DELETE.DESCRIPTION', { currency }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  }, []);

  return {
    indicator,
    depositCurrencies,
    addNewDepositAmount,
    editDepositAmount,
    deleteDepositAmount,
  };
};

export default useDepositGrid;
