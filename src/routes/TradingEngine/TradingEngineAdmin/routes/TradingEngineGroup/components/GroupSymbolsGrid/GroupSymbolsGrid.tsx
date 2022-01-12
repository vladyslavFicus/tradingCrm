import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { FormikProps } from 'formik';
import { withModals } from 'hoc';
import { Modal, ConfirmationModal } from 'types/modal';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { Button, EditButton } from 'components/UI';
import GroupNewSymbolModal from '../../modals/GroupNewSymbolModal';
import { Margin, Group } from '../../types';
import './GroupSymbolsGrid.scss';

interface Props {
  formik: FormikProps<Group>,
  modals: {
    confirmationModal: ConfirmationModal,
    groupNewSymbolModal: Modal<{
      onSuccess: (symbol: Margin) => void,
      groupMargin?: Margin,
      groupMargins?: Margin[]
    }>,
  },
}

const GroupSymbolsGrid = ({ modals, formik }: Props) => {
  const { confirmationModal, groupNewSymbolModal } = modals;
  const { values, setFieldValue } = formik;
  const groupMargins = values?.groupMargins || [];

  const handleNewGroupSymbol = (symbol: Margin) => {
    setFieldValue('groupMargins', [...groupMargins, symbol]);
  };

  const handleEditGroupSymbol = (groupMargin: Margin) => {
    const modifiedGroupMargins = groupMargins.map((_groupMargin: Margin) => (
      _groupMargin.symbol === groupMargin.symbol
        ? groupMargin
        : _groupMargin
    ));
    setFieldValue('groupMargins', modifiedGroupMargins);
  };

  const handleDeleteGroupSymbol = (id: string) => {
    const modifiedGroupMargins = groupMargins.filter(({ symbol }: Margin) => symbol !== id);
    setFieldValue('groupMargins', modifiedGroupMargins);
    confirmationModal.hide();
  };

  const handleNewGroupSymbolModal = () => {
    groupNewSymbolModal.show({
      onSuccess: handleNewGroupSymbol,
      groupMargins,
    });
  };

  const handleEditGroupSymbolModal = (symbol: Margin) => {
    groupNewSymbolModal.show({
      onSuccess: handleEditGroupSymbol,
      groupMargin: symbol,
    });
  };

  const handleDeleteGroupSymbolModal = ({ symbol }: Margin) => {
    confirmationModal.show({
      onSubmit: () => handleDeleteGroupSymbol(symbol),
      modalTitle: I18n.t('TRADING_ENGINE.GROUP.SYMBOLS_TABLE.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.GROUP.SYMBOLS_TABLE.CONFIRMATION.DELETE.DESCRIPTION', { symbol }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  return (
    <div className="GroupSymbolsGrid">
      <div className="GroupSymbolsGrid__header">
        <span className="GroupSymbolsGrid__title">
          {I18n.t('TRADING_ENGINE.GROUP.SYMBOLS_TABLE.TITLE')}
        </span>
        <Button
          onClick={handleNewGroupSymbolModal}
          commonOutline
          small
        >
          {I18n.t('TRADING_ENGINE.GROUP.SYMBOLS_TABLE.ADD_SYMBOL')}
        </Button>
      </div>
      <div
        id="group-symbols-table-scrollable-target"
        className="GroupSymbolsGrid__scrollableTarget"
      >
        <Table
          stickyFromTop={0}
          items={groupMargins}
          scrollableTarget="group-symbols-table-scrollable-target"
        >
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SYMBOLS_TABLE.SYMBOL')}
            render={({ symbol }: Margin) => (
              <div className="GroupSymbolsGrid__cell-primary">
                {symbol}
              </div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SYMBOLS_TABLE.LONG')}
            render={({ swapLong }: Margin) => (
              <div className="GroupSymbolsGrid__cell-primary">
                {swapLong}
              </div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SYMBOLS_TABLE.SHORT')}
            render={({ swapShort }: Margin) => (
              <div className="GroupSymbolsGrid__cell-primary">
                {swapShort}
              </div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.GROUP.SYMBOLS_TABLE.PERCENTAGE')}
            render={({ percentage }: Margin) => (
              <div className="GroupSymbolsGrid__cell-primary">
                {percentage}
              </div>
            )}
          />
          <Column
            width={120}
            header={I18n.t('TRADING_ENGINE.GROUP.SYMBOLS_TABLE.ACTIONS')}
            render={(symbol: Margin) => (
              <>
                <EditButton
                  onClick={() => handleEditGroupSymbolModal(symbol)}
                  className="GroupSymbolsGrid__edit-button"
                />
                <Button
                  transparent
                  onClick={() => handleDeleteGroupSymbolModal(symbol)}
                >
                  <i className="fa fa-trash btn-transparent color-danger" />
                </Button>
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
    confirmationModal: ConfirmActionModal,
    groupNewSymbolModal: GroupNewSymbolModal,
  }),
)(GroupSymbolsGrid);
