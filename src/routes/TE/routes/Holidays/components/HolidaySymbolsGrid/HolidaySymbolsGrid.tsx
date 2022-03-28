import React, { useMemo } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { FormikProps } from 'formik';
import { withModals } from 'hoc';
import { Modal } from 'types/modal';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { Button } from 'components/UI';
import HolidayNewSymbolModal from '../../modals/HolidayNewSymbolModal';
import { FormValues } from '../../types';
import { useSymbolsQuery } from './graphql/__generated__/SymbolsQuery';
import './HolidaySymbolsGrid.scss';

interface ConfirmationModalProps {
  onSubmit: () => void,
  modalTitle: string,
  actionText: string,
  submitButtonLabel: string,
}

interface HolidayNewSymbolModalProps {
  onSuccess: (symbol: string) => void,
  symbols: string[],
}

interface Props {
  formik: FormikProps<FormValues>,
  modals: {
    confirmationModal: Modal<ConfirmationModalProps>,
    holidayNewSymbolModal: Modal<HolidayNewSymbolModalProps>,
  },
}

const HolidaySymbolsGrid = (props: Props) => {
  const {
    modals: {
      confirmationModal,
      holidayNewSymbolModal,
    },
    formik: {
      values,
      setFieldValue,
    },
  } = props;

  const symbolsQuery = useSymbolsQuery({
    variables: {
      args: {
        page: {
          from: 0,
          size: 1000000,
        },
      },
    },
  });

  const serverSymbols = symbolsQuery.data?.tradingEngine.symbols.content || [];

  // Construct an object with source symbol as a key and array of followed symbols as a value
  const symbolSources = useMemo(
    () => serverSymbols.reduce<{ [key: string]: string[] }>((acc, curr) => {
      if (curr.source) {
        // Create new array of followed symbols for source symbol
        if (!acc[curr.source]) {
          acc[curr.source] = [];
        }

        acc[curr.source].push(curr.symbol);
      }

      return acc;
    }, {}),
    [serverSymbols],
  );

  const handleDeleteHolidaySymbol = (symbol: string) => {
    const symbols = values.symbols.filter(_symbol => symbol !== _symbol);

    setFieldValue('symbols', symbols);

    confirmationModal.hide();
  };

  const handleNewHolidaySymbolClick = () => {
    holidayNewSymbolModal.show({
      onSuccess: (symbol: string) => {
        setFieldValue('symbols', [...values.symbols, symbol]);
      },
      symbols: values.symbols,
    });
  };

  const handleDeleteHolidaySymbolClick = (symbol: string) => {
    confirmationModal.show({
      onSubmit: () => handleDeleteHolidaySymbol(symbol),
      modalTitle: I18n.t('TRADING_ENGINE.HOLIDAY.SYMBOLS_TABLE.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.HOLIDAY.SYMBOLS_TABLE.CONFIRMATION.DELETE.DESCRIPTION', { symbol }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  return (
    <div className="HolidaySymbolsGrid">
      <div className="HolidaySymbolsGrid__header">
        <span className="HolidaySymbolsGrid__title">
          {I18n.t('TRADING_ENGINE.HOLIDAY.SYMBOLS_TABLE.TITLE')}
        </span>
        <Button
          onClick={handleNewHolidaySymbolClick}
          commonOutline
          small
        >
          {I18n.t('TRADING_ENGINE.HOLIDAY.SYMBOLS_TABLE.ADD_SYMBOL')}
        </Button>
      </div>
      <div
        id="holiday-symbols-table-scrollable-target"
        className="HolidaySymbolsGrid__scrollableTarget"
      >
        <Table
          stickyFromTop={0}
          items={values.symbols}
          scrollableTarget="holiday-symbols-table-scrollable-target"
        >
          <Column
            header={I18n.t('TRADING_ENGINE.HOLIDAY.SYMBOLS_TABLE.SYMBOL')}
            render={(symbol: string) => (
              <div className="HolidaySymbolsGrid__cell-primary">
                {symbol}
              </div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.HOLIDAY.SYMBOLS_TABLE.AFFECTED_SYMBOLS')}
            render={(symbol: string) => (
              <div className="HolidaySymbolsGrid__cell-primary">
                <Choose>
                  <When condition={!!symbolSources[symbol]}>
                    {symbolSources[symbol].join(', ')}
                  </When>
                  <Otherwise>
                    &mdash;
                  </Otherwise>
                </Choose>
              </div>
            )}
          />
          <Column
            width={120}
            header={I18n.t('TRADING_ENGINE.HOLIDAY.SYMBOLS_TABLE.ACTIONS')}
            render={(symbol: string) => (
              <>
                <Button
                  transparent
                  onClick={() => handleDeleteHolidaySymbolClick(symbol)}
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
    holidayNewSymbolModal: HolidayNewSymbolModal,
  }),
)(HolidaySymbolsGrid);
