import React, { useEffect, useState } from 'react';
import I18n from 'i18n-js';
import { v4 } from 'uuid';
import { useModal } from 'providers/ModalProvider';
import { PaymentDeposit } from '__generated__/types';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { EditButton, TrashButton, Button } from 'components/Buttons';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import UpdateDepositAmountModal,
{ UpdateDepositAmountModalProps } from 'routes/FeatureToggles/modals/UpdateDepositAmountModal';
import './DepositGrid.scss';

type Props = {
  depositAmounts: Array<PaymentDeposit>,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
}

const DepositGrid = (props: Props) => {
  const { depositAmounts, setFieldValue } = props;
  const [depositCurrencies, setDepositCurrencies] = useState<Array<PaymentDeposit>>([]);

  useEffect(() => {
    setDepositCurrencies(depositAmounts);
  }, [depositAmounts]);

  const indicator = v4();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const updateDepositAmountModal = useModal<UpdateDepositAmountModalProps>(UpdateDepositAmountModal);

  const handleNewDepositAmount = (newCurrency: PaymentDeposit) => {
    const newDepositAmounts = [...depositCurrencies, newCurrency];

    setDepositCurrencies(newDepositAmounts);
    setFieldValue('paymentDeposits', newDepositAmounts);
  };

  const handleEditDepositAmount = (depositAmount: PaymentDeposit) => {
    const modifiedDepositAmount = depositCurrencies.map(_depositAmount => (
      _depositAmount.currency === depositAmount.currency
        ? depositAmount
        : _depositAmount
    ));

    setDepositCurrencies(modifiedDepositAmount);
    setFieldValue('paymentDeposits', modifiedDepositAmount);
  };

  const handleDeleteDepositAmount = (currency: string) => {
    const modifiedDepositAmount = depositCurrencies.filter(deposit => deposit.currency !== currency);

    setDepositCurrencies(modifiedDepositAmount);
    setFieldValue('paymentDeposits', modifiedDepositAmount);

    confirmActionModal.hide();
  };

  const addNewDepositAmount = () => {
    const currencies = depositCurrencies.map(deposit => deposit.currency);

    updateDepositAmountModal.show({
      onSuccess: handleNewDepositAmount,
      currencies,
    });
  };

  const editDepositAmount = (depositAmount: PaymentDeposit) => {
    updateDepositAmountModal.show({
      depositAmount,
      onSuccess: handleEditDepositAmount,
    });
  };

  const deleteDepositAmount = ({ currency }: PaymentDeposit) => {
    confirmActionModal.show({
      onSubmit: () => handleDeleteDepositAmount(currency),
      modalTitle: I18n.t('FEATURE_TOGGLES.FEATURE_FORM.TABLE.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('FEATURE_TOGGLES.FEATURE_FORM.TABLE.CONFIRMATION.DELETE.DESCRIPTION', { currency }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  return (
    <div className="DepositGrid">
      <div className="DepositGrid__header">
        <span className="DepositGrid__title">
          {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.TABLE.TITLE')}

          <i className="DepositGrid__icon-info fa fa-info-circle" id={`deposit-${indicator}`} />

          <UncontrolledTooltip
            placement="right"
            target={`deposit-${indicator}`}
            delay={{ show: 0, hide: 0 }}
            fade={false}
          >
            {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.TABLE.DESCRIPTION')}
          </UncontrolledTooltip>
        </span>

        <Button
          data-testid="DepositGrid-addCurrencyButton"
          onClick={addNewDepositAmount}
          tertiary
          small
        >
          {I18n.t('FEATURE_TOGGLES.FEATURE_FORM.TABLE.ADD_CURRENCY')}
        </Button>
      </div>

      <div
        id="group-securities-table-scrollable-target"
        className="DepositGrid__scrollableTarget"
      >
        <Table
          maxHeightColumns={300}
          items={depositCurrencies || []}
          scrollableTarget="group-securities-table-scrollable-target"
        >
          <Column
            header={I18n.t('FEATURE_TOGGLES.FEATURE_FORM.TABLE.CURRENCY')}
            render={({ currency }: PaymentDeposit) => (
              <div className="GroupsGrid__cell-primary">
                {currency}
              </div>
            )}
          />

          <Column
            header={I18n.t('FEATURE_TOGGLES.FEATURE_FORM.TABLE.MIN_DEPOSIT')}
            render={({ min }: PaymentDeposit) => (
              <div className="GroupsGrid__cell-primary">
                {min}
              </div>
            )}
          />

          <Column
            header={I18n.t('FEATURE_TOGGLES.FEATURE_FORM.TABLE.MAX_DEPOSIT')}
            render={({ max }: PaymentDeposit) => (
              <div className="GroupsGrid__cell-primary">
                {max}
              </div>
            )}
          />

          <Column
            width={120}
            header={I18n.t('FEATURE_TOGGLES.FEATURE_FORM.TABLE.ACTIONS')}
            render={(depositAmount: PaymentDeposit) => (
              <>
                <EditButton
                  onClick={() => editDepositAmount(depositAmount)}
                  className="DepositGrid__edit-button"
                  data-testid="DepositGrid-editButton"
                />

                <TrashButton
                  onClick={() => deleteDepositAmount(depositAmount)}
                  className="DepositGrid__delete-button"
                  data-testid="DepositGrid-trashButton"
                />
              </>
            )}
          />
        </Table>
      </div>
    </div>
  );
};

export default React.memo(DepositGrid);
