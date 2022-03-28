import React, { useMemo } from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { FormikProps } from 'formik';
import { withModals } from 'hoc';
import { Modal } from 'types/modal';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { Button } from 'components/UI';
import CircleLoader from 'components/CircleLoader';
import HolidayNewSymbolModal from '../../modals/HolidayNewSymbolModal';
import { FormValues } from '../../types';
import { useSymbolsSourcesQuery } from './graphql/__generated__/SymbolsSourcesQuery';
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

  const symbolsSourcesQuery = useSymbolsSourcesQuery();

  const serverSymbolSources = symbolsSourcesQuery.data?.tradingEngine.symbolsSources || [];

  // Construct an object with source symbol as a key and array of followed symbols as a value
  const symbolSources = useMemo(
    () => serverSymbolSources.reduce<{ [key: string]: string[] }>((acc, curr) => {
      acc[curr.sourceName] = curr.children;

      return acc;
    }, {}),
    [serverSymbolSources],
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
      <Table
        stickyFromTop={0}
        items={[...values.symbols].sort()}
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
                <When condition={symbolsSourcesQuery.loading}>
                  <CircleLoader />
                </When>
                <When condition={symbolSources[symbol].length > 0}>
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
  );
};

export default compose(
  React.memo,
  withModals({
    confirmationModal: ConfirmActionModal,
    holidayNewSymbolModal: HolidayNewSymbolModal,
  }),
)(HolidaySymbolsGrid);
