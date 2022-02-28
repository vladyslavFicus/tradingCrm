import React from 'react';
import classNames from 'classnames';
import { round } from 'utils/round';
import { useSymbolPricesStream } from 'routes/TE/components/SymbolPricesStream';
import Chart from './components/Chart';
import { ReactComponent as SymbolChartIcon } from './SymbolChartIcon.svg';
import { useSymbolQuery, SymbolQueryQueryResult } from './graphql/__generated__/SymbolQuery';
import './SymbolChart.scss';

interface Props {
  symbol: string,
  accountUuid: string,
  askLineColor?: string,
  bidLineColor?: string,
}

const defaultProps = {
  askLineColor: undefined,
  bidLineColor: undefined,
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
  const { symbol, accountUuid, askLineColor, bidLineColor } = props;

  const symbolQuery = useSymbolQuery({
    variables: {
      symbol,
      accountUuid,
      pricesSize: 2000,
    },
    skip: !symbol || !accountUuid,
  });

  const chartData = getChartData(symbolQuery);

  const nextTickItem = useSymbolPricesStream(symbol);

  const isLoading = !symbol || !accountUuid || symbolQuery.loading;

  return (
    <div className={classNames('SymbolChart', { 'SymbolChart--loading': isLoading })}>
      <Choose>
        <When condition={isLoading}>
          <SymbolChartIcon className="SymbolChart__icon" />
        </When>
        <Otherwise>
          <>
            <div className="SymbolChart__label">{symbol}</div>
            <Chart
              chartData={chartData}
              chartNextTickItem={nextTickItem}
              bidLineColor={bidLineColor}
              askLineColor={askLineColor}
            />
          </>
        </Otherwise>
      </Choose>
    </div>
  );
};

SymbolChart.defaultProps = defaultProps;

export default React.memo(SymbolChart);
