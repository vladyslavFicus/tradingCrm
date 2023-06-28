import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { FormikProps } from 'formik';
import classNames from 'classnames';
import { withModals } from 'hoc';
import { Modal } from 'types/modal';
import { useModal } from 'providers/ModalProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { Button, EditButton, TrashButton } from 'components/Buttons';
import GroupNewSymbolModal from '../../modals/GroupNewSymbolModal';
import { GroupSymbol, GroupSecurity, FormValues } from '../../types';
import './GroupSymbolsGrid.scss';

interface GroupNewSymbolModalProps {
  onSuccess: (symbol: GroupSymbol) => void,
  groupSymbol?: GroupSymbol,
  groupSymbols?: GroupSymbol[],
  groupSecurities?: GroupSecurity[],
}

type Props = {
  formik: FormikProps<FormValues>,
  modals: {
    groupNewSymbolModal: Modal<GroupNewSymbolModalProps>,
  },
}

const GroupSymbolsGrid = ({ modals, formik }: Props) => {
  const {
    groupNewSymbolModal,
  } = modals;

  const { values, setFieldValue } = formik;

  const groupSymbols = values?.groupSymbols || [];
  const groupSecurities = values?.groupSecurities || [];
  const archived = !values.enabled;

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

  const handleNewGroupSymbol = (symbol: GroupSymbol) => {
    setFieldValue('groupSymbols', [...groupSymbols, symbol]);
  };

  const handleEditGroupSymbol = (groupSymbol: GroupSymbol) => {
    const modifiedGroupSymbols = groupSymbols.map((_groupSymbol: GroupSymbol) => (
      _groupSymbol.symbol === groupSymbol.symbol
        ? groupSymbol
        : _groupSymbol
    ));
    setFieldValue('groupSymbols', modifiedGroupSymbols);
  };

  const handleDeleteGroupSymbol = (id: string) => {
    const modifiedGroupSymbols = groupSymbols.filter(({ symbol }: GroupSymbol) => symbol !== id);
    setFieldValue('groupSymbols', modifiedGroupSymbols);
    confirmActionModal.hide();
  };

  const handleNewGroupSymbolModal = () => {
    groupNewSymbolModal.show({
      onSuccess: handleNewGroupSymbol,
      groupSymbols,
      groupSecurities,
    });
  };

  const handleEditGroupSymbolModal = (symbol: GroupSymbol) => {
    groupNewSymbolModal.show({
      onSuccess: handleEditGroupSymbol,
      groupSymbol: symbol,
      groupSecurities,
    });
  };

  const handleDeleteGroupSymbolModal = ({ symbol }: GroupSymbol) => {
    confirmActionModal.show({
      onSubmit: () => handleDeleteGroupSymbol(symbol),
      modalTitle: I18n.t('TRADING_ENGINE.GROUP.SYMBOL_OVERRIDES_TABLE.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.GROUP.SYMBOL_OVERRIDES_TABLE.CONFIRMATION.DELETE.DESCRIPTION', { symbol }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  return (
    <div className="GroupSymbolsGrid">
      <div className="GroupSymbolsGrid__header">
        <span className="GroupSymbolsGrid__title">
          {I18n.t('TRADING_ENGINE.GROUP.SYMBOL_OVERRIDES_TABLE.TITLE')}
        </span>
        <Button
          disabled={archived}
          data-testid="GroupSymbolsGrid-addSymbolButton"
          onClick={handleNewGroupSymbolModal}
          tertiary
          small
        >
          {I18n.t('TRADING_ENGINE.GROUP.SYMBOL_OVERRIDES_TABLE.ADD_SYMBOL')}
        </Button>
      </div>
      <div
        id="group-symbols-table-scrollable-target"
        className="GroupSymbolsGrid__scrollableTarget"
      >
        <Table
          maxHeightColumns={300}
          items={groupSymbols}
          scrollableTarget="group-symbols-table-scrollable-target"
          customClassNameRow={({ enabled }: GroupSymbol) => (
            classNames({
              'GroupSymbolsGrid__row--disabled': !enabled,
            }))
          }
        >
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SYMBOL_OVERRIDES_TABLE.SYMBOL')}
            render={({ symbol }: GroupSymbol) => (
              <div className="GroupSymbolsGrid__cell-primary">
                {symbol}
              </div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SYMBOL_OVERRIDES_TABLE.STATUS')}
            render={({ enabled }: GroupSymbol) => (
              <div
                className={classNames('GroupSymbolsGrid__cell-primary', {
                  'GroupSymbolsGrid__cell--disabled': !enabled,
                })}
              >
                {I18n.t(`TRADING_ENGINE.GROUP.${enabled ? 'ENABLED' : 'DISABLED'}`)}
              </div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SYMBOL_OVERRIDES_TABLE.LONG')}
            render={({ swapLong }: GroupSymbol) => (
              <div className="GroupSymbolsGrid__cell-primary">
                {swapLong}
              </div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SYMBOL_OVERRIDES_TABLE.SHORT')}
            render={({ swapShort }: GroupSymbol) => (
              <div className="GroupSymbolsGrid__cell-primary">
                {swapShort}
              </div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SYMBOL_OVERRIDES_TABLE.PERCENTAGE')}
            render={({ percentage }: GroupSymbol) => (
              <div className="GroupSymbolsGrid__cell-primary">
                {percentage}
              </div>
            )}
          />
          <Column
            width={120}
            header={I18n.t('TRADING_ENGINE.GROUP.SYMBOL_OVERRIDES_TABLE.ACTIONS')}
            render={(symbol: GroupSymbol) => (
              <>
                <EditButton
                  disabled={archived}
                  onClick={() => handleEditGroupSymbolModal(symbol)}
                  className="GroupSymbolsGrid__edit-button"
                  data-testid="GroupSymbolsGrid-editButton"
                />
                <TrashButton
                  disabled={archived}
                  onClick={() => handleDeleteGroupSymbolModal(symbol)}
                  className="GroupSymbolsGrid__delete-button"
                  data-testid="GroupSymbolsGrid-trashButton"
                />
              </>
            )}
          />
        </Table>
      </div>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    groupNewSymbolModal: GroupNewSymbolModal,
  }),
)(GroupSymbolsGrid);
