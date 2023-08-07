import React, { useMemo } from 'react';
import I18n from 'i18n-js';
import { FormikProps } from 'formik';
import { useModal } from 'providers/ModalProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { Button, TrashButton, CircleLoader } from 'components';
import HolidayNewSymbolModal, { HolidayNewSymbolModalProps } from '../../modals/HolidayNewSymbolModal';
import { FormValues } from '../../types';
import { useSymbolsSourcesQuery } from './graphql/__generated__/SymbolsSourcesQuery';
import './HolidaySymbolsGrid.scss';

type Props = {
  formik: FormikProps<FormValues>,
}

const HolidaySymbolsGrid = (props: Props) => {
  const {
    formik: {
      values,
      setFieldValue,
    },
  } = props;

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const holidayNewSymbolModal = useModal<HolidayNewSymbolModalProps>(HolidayNewSymbolModal);

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

    confirmActionModal.hide();
  };

  const handleNewHolidaySymbolClick = () => {
    holidayNewSymbolModal.show({
      onSuccess: (symbols: string[]) => {
        setFieldValue('symbols', [...values.symbols, ...symbols]);
      },
      symbols: values.symbols,
    });
  };

  const handleDeleteHolidaySymbolClick = (symbol: string) => {
    confirmActionModal.show({
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
          data-testid="HolidaySymbolsGrid-addSymbolButton"
          onClick={handleNewHolidaySymbolClick}
          tertiary
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
            <TrashButton
              data-testid="HolidaySymbolsGrid-trashButton"
              onClick={() => handleDeleteHolidaySymbolClick(symbol)}
            />
          )}
        />
      </Table>
    </div>
  );
};

export default React.memo(HolidaySymbolsGrid);
