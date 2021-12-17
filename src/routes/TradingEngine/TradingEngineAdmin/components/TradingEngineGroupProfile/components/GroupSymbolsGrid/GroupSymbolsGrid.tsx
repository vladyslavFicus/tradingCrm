import React from 'react';
import I18n from 'i18n-js';
import { FormikProps } from 'formik';
import { withModals } from 'hoc';
import { Modal } from 'types/modal';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { Button, EditButton } from 'components/UI';
import GroupNewSymbolModal from '../../modals/GroupNewSymbolModal';
import { Symbol } from '../../types';
import './GroupSymbolsGrid.scss';

interface Props {
  formik: FormikProps<Symbol>,
  modals: {
    confirmationModal: Modal,
    groupNewSymbolModal: Modal,
  },
}

const renderSymbol = ({ symbol }: Symbol) => (
  <div className="GroupsGrid__cell-primary">
    {symbol}
  </div>
);

const renderLong = ({ swapConfigs }: Symbol) => (
  <div className="GroupsGrid__cell-primary">
    {swapConfigs?.long}
  </div>
);

const renderShort = ({ swapConfigs }: Symbol) => (
  <div className="GroupsGrid__cell-primary">
    {swapConfigs?.short}
  </div>
);

const renderPercentage = ({ percentage }: Symbol) => (
  <div className="GroupsGrid__cell-primary">
    {percentage}
  </div>
);

const renderActions = (
  symbol: Symbol,
  handleDeleteSecurity: (symbol: Symbol) => void,
  handleEditSecurity: (symbol: Symbol) => void,
) => (
  <>
    <EditButton
      onClick={() => handleEditSecurity(symbol)}
      className="GroupSecuritiesGrid__edit-button"
    />
    <Button
      transparent
      onClick={() => handleDeleteSecurity(symbol)}
    >
      <i className="fa fa-trash btn-transparent color-danger" />
    </Button>
  </>
);

const GroupSymbolsGrid = ({ modals, formik }: Props) => {
  const { confirmationModal, groupNewSymbolModal } = modals;
  const { values: { groupSymbols }, setFieldValue } = formik;

  const newSymbol = (symbol: Symbol) => {
    setFieldValue('groupSymbols', [...groupSymbols, symbol]);
  };

  const editSymbol = (editableSymbol: Symbol) => {
    const modifiedSymbol = groupSymbols.map((symbol: Symbol) => (
      symbol.symbolId === editableSymbol.symbolId
        ? editableSymbol
        : symbol
    ));
    setFieldValue('groupSymbols', modifiedSymbol);
  };

  const deleteSymbol = (symbolId: number) => {
    const modifiedSymbol = groupSymbols.filter((symbol: Symbol) => symbol.symbolId !== symbolId);
    setFieldValue('groupSymbols', modifiedSymbol);
    confirmationModal.hide();
  };


  const handleNewSymbol = () => {
    groupNewSymbolModal.show({
      onSuccess: newSymbol,
    });
  };

  const handleEditSymbol = (symbol: Symbol) => {
    groupNewSymbolModal.show({
      modifiedSymbol: symbol,
      onSuccess: editSymbol,
    });
  };

  const handleDeleteSymbol = ({ symbolId, symbol }: Symbol) => {
    confirmationModal.show({
      onSubmit: () => deleteSymbol(symbolId),
      modalTitle: I18n.t('TRADING_ENGINE.GROUP_PROFILE.SYMBOLS_TABLE.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.GROUP_PROFILE.SYMBOLS_TABLE.CONFIRMATION.DELETE.DESCRIPTION', { symbol }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  return (
    <div className="GroupSymbolsGrid">
      <div className="GroupSymbolsGrid__header">
        <span className="GroupSymbolsGrid__title">
          {I18n.t('TRADING_ENGINE.GROUP_PROFILE.SYMBOLS_TABLE.TITLE')}
        </span>
        <Button
          onClick={handleNewSymbol}
          commonOutline
          small
        >
          {I18n.t('TRADING_ENGINE.GROUP_PROFILE.SYMBOLS_TABLE.ADD_SYMBOL')}
        </Button>
      </div>
      <Table
        stickyFromTop={123}
        items={groupSymbols}
      >
        <Column
          sortBy="symbol"
          header={I18n.t('TRADING_ENGINE.GROUP_PROFILE.SYMBOLS_TABLE.SYMBOL')}
          render={renderSymbol}
        />
        <Column
          sortBy="long"
          header={I18n.t('TRADING_ENGINE.GROUP_PROFILE.SYMBOLS_TABLE.LONG')}
          render={renderLong}
        />
        <Column
          sortBy="short"
          header={I18n.t('TRADING_ENGINE.GROUP_PROFILE.SYMBOLS_TABLE.SHORT')}
          render={renderShort}
        />
        <Column
          sortBy="percentage"
          header={I18n.t('TRADING_ENGINE.GROUP_PROFILE.SYMBOLS_TABLE.PERCENTAGE')}
          render={renderPercentage}
        />
        <Column
          width={120}
          header={I18n.t('TRADING_ENGINE.GROUP_PROFILE.SYMBOLS_TABLE.ACTIONS')}
          render={(symbol: Symbol) => renderActions(symbol, handleDeleteSymbol, handleEditSymbol)}
        />
      </Table>
    </div>
  );
};

export default React.memo(
  withModals({
    confirmationModal: ConfirmActionModal,
    groupNewSymbolModal: GroupNewSymbolModal,
  })(GroupSymbolsGrid),
);
