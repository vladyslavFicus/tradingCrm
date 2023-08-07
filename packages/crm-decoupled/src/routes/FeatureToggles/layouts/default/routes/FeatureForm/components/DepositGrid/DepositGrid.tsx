import React from 'react';
import I18n from 'i18n-js';
import { PaymentDeposit } from '__generated__/types';
import { Table, Column } from 'components/Table';
import { EditButton, TrashButton, Button } from 'components';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import './DepositGrid.scss';
import useDepositGrid from '../../../../../../hooks/useDepositGrid';

type Props = {
  depositAmounts: Array<PaymentDeposit>,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
};

const DepositGrid = (_props: Props) => {
  const {
    indicator,
    depositCurrencies,
    addNewDepositAmount,
    editDepositAmount,
    deleteDepositAmount,
  } = useDepositGrid(_props);

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
