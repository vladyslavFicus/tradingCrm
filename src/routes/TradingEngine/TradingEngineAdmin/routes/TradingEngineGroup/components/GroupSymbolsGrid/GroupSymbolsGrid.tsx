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
      editableGroupMargin?: Margin,
      groupMargins?: Margin[]
    }>,
  },
}

const GroupSymbolsGrid = ({ modals, formik }: Props) => {
  const { confirmationModal, groupNewSymbolModal } = modals;
  const { values, setFieldValue } = formik;
  const groupMargins = values?.groupMargins || [];

  const newGroupSymbol = (symbol: Margin) => {
    setFieldValue('groupMargins', [...groupMargins, symbol]);
  };

  const editGroupSymbol = (editableGroupMargin: Margin) => {
    const modifiedGroupMargins = groupMargins.map((groupMargin: Margin) => (
      groupMargin.symbol === editableGroupMargin.symbol
        ? editableGroupMargin
        : groupMargin
    ));
    setFieldValue('groupMargins', modifiedGroupMargins);
  };

  const deleteGroupSymbol = (id: string) => {
    const modifiedGroupMargins = groupMargins.filter(({ symbol }: Margin) => symbol !== id);
    setFieldValue('groupMargins', modifiedGroupMargins);
    confirmationModal.hide();
  };

  const handleNewGroupSymbolModal = () => {
    groupNewSymbolModal.show({
      onSuccess: newGroupSymbol,
      groupMargins,
    });
  };

  const handleEditGroupSymbolModal = (symbol: Margin) => {
    groupNewSymbolModal.show({
      onSuccess: editGroupSymbol,
      editableGroupMargin: symbol,
    });
  };

  const handleDeleteGroupSymbolModal = ({ symbol }: Margin) => {
    confirmationModal.show({
      onSubmit: () => deleteGroupSymbol(symbol),
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
      <Table
        stickyFromTop={123}
        items={groupMargins}
        className="GroupSymbolsGrid__table"
        withCustomScroll
      >
        <Column
          header={I18n.t('TRADING_ENGINE.GROUP.SYMBOLS_TABLE.SYMBOL')}
          render={({ symbol }: Margin) => (
            <div className="GroupsGrid__cell-primary">
              {symbol}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.GROUP.SYMBOLS_TABLE.LONG')}
          render={({ swapLong }: Margin) => (
            <div className="GroupsGrid__cell-primary">
              {swapLong}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.GROUP.SYMBOLS_TABLE.SHORT')}
          render={({ swapShort }: Margin) => (
            <div className="GroupsGrid__cell-primary">
              {swapShort}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.GROUP.SYMBOLS_TABLE.PERCENTAGE')}
          render={({ percentage }: Margin) => (
            <div className="GroupsGrid__cell-primary">
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
  );
};

export default compose(
  React.memo,
  withModals({
    confirmationModal: ConfirmActionModal,
    groupNewSymbolModal: GroupNewSymbolModal,
  }),
)(GroupSymbolsGrid);
