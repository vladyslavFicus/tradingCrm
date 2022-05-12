import React from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import moment from 'moment';
import { round } from 'utils/round';
import { useSymbolPricesStream } from 'routes/TE/components/SymbolPricesStream';
import Chart from './components/Chart';
import { useSymbolQuery, SymbolQueryQueryResult } from './graphql/__generated__/SymbolQuery';
import { ReactComponent as SymbolChartIcon } from './img/SymbolChartIcon.svg';
import { ReactComponent as SymbolChartLoadingIcon } from './img/SymbolChartLoadingIcon.svg';
import { ReactComponent as WarningIcon } from './img/warning.svg';
import './SymbolChart.scss';

interface Props {
  symbol: string,
  accountUuid: string,
  askLineColor?: string,
  bidLineColor?: string,
  loading?: boolean, // Custom loader controlled outside
}

const defaultProps = {
  askLineColor: undefined,
  bidLineColor: undefined,
  loading: false,
};

/**
 * Get chart data helper with applied group spread on each price
 *
 * @param symbolQuery
 */
const getChartData = (symbolQuery: SymbolQueryQueryResult) => {
  // Return empty array of prices while loading data
  if (symbolQuery.loading) {
    return [];
  }

  const {
    digits,
    config,
    prices,
  } = symbolQuery.data?.tradingEngine.symbol || {};

  const { bidAdjustment = 0, askAdjustment = 0 } = config || {};

  return prices?.map((price) => {
    const bid = round(price.bid - bidAdjustment, digits);
    const ask = round(price.ask + askAdjustment, digits);

    return { ...price, bid, ask };
  });
};

const SymbolChart = (props: Props) => {
  const {
    symbol,
    accountUuid,
    askLineColor,
    bidLineColor,
    loading = false,
  } = props;

  const symbolQuery = useSymbolQuery({
    variables: {
      symbol,
      accountUuid,
      pricesSize: 2000,
    },
    skip: !symbol || !accountUuid,
  });

  const currentHolidays = symbolQuery.data?.tradingEngine.symbol.currentHolidays || [];

  const chartData = getChartData(symbolQuery);

  const nextTickItem = useSymbolPricesStream(symbol);

  const isLoading = !symbol || !accountUuid || symbolQuery.loading || loading;

  return (
    <div className={classNames('SymbolChart', { 'SymbolChart--loading': isLoading })}>
      <Choose>
        {/* Show animated image when query in flight or loading was provided outside */}
        <When condition={symbolQuery.loading || loading}>
          <SymbolChartLoadingIcon className="SymbolChart__icon" />
        </When>
        {/* Show static image when accountUuid or symbols wasn't provided */}
        <When condition={!accountUuid}>
          <SymbolChartIcon className="SymbolChart__icon" />
        </When>
        <Otherwise>
          <>
            <div className="SymbolChart__label">{symbol}</div>
            <Chart
              key={symbol}
              chartData={chartData}
              chartNextTickItem={nextTickItem}
              bidLineColor={bidLineColor}
              askLineColor={askLineColor}
            />
            <If condition={currentHolidays.length > 0}>
              <div className="SymbolChart__error-container">
                <WarningIcon className="SymbolChart__error-icon" />
                <div>
                  {currentHolidays.map((holiday, index) => (
                    <div key={index}>
                      <b>{holiday.description}</b>:&nbsp;
                      {I18n.t('TRADING_ENGINE.SYMBOL_CHART.HOLIDAY_WARNING', {
                        date: moment(holiday.date).format('DD/MM/YYYY'),
                        from: moment(holiday.timeRange.from, 'HH:mm:ss').format('HH:mm'),
                        to: moment(holiday.timeRange.to, 'HH:mm:ss').format('HH:mm'),
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </If>
          </>
        </Otherwise>
      </Choose>
    </div>
  );
};

SymbolChart.defaultProps = defaultProps;

export default React.memo(SymbolChart);
