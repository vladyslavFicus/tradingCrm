import React, { Fragment, PureComponent } from 'react';
import { compose } from 'react-apollo';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { round } from 'utils/round';
import SymbolPricesStream from 'routes/TradingEngine/components/SymbolPricesStream';
import Chart from './components/Chart';
import { ReactComponent as SymbolChartIcon } from './SymbolChartIcon.svg';
import SymbolChartQuery from './graphql/SymbolChartQuery';
import SymbolQuery from './graphql/SymbolQuery';
import './SymbolChart.scss';

class SymbolChart extends PureComponent {
  static propTypes = {
    symbol: PropTypes.string,
    accountUuid: PropTypes.string,
    chartQuery: PropTypes.query({
      tradingEngineSymbolPrices: PropTypes.shape({
        name: PropTypes.string,
        ask: PropTypes.number.isRequired,
        bid: PropTypes.number.isRequired,
        time: PropTypes.string.isRequired,
      }),
    }).isRequired,
    symbolQuery: PropTypes.query({
      digits: PropTypes.string,
      groupSpread: PropTypes.shape({
        bidAdjustment: PropTypes.number,
        askAdjustment: PropTypes.number,
      }),
    }).isRequired,
    chartConfig: PropTypes.object,
  };

  static defaultProps = {
    chartConfig: {},
    symbol: null,
    accountUuid: null,
  };

  state = {
    chartNextTickItem: null,
  };

  handleSymbolsPricesTick = (chartNextTickItem) => {
    this.setState({ chartNextTickItem: this.addGroupSpread(chartNextTickItem) });
  };

  addGroupSpread = (item) => {
    const {
      digits,
      groupSpread,
    } = this.props.symbolQuery.data?.tradingEngineSymbol || {};

    const bid = round(item.bid - groupSpread?.bidAdjustment, digits);
    const ask = round(item.ask + groupSpread?.askAdjustment, digits);

    return { ...item, bid, ask };
  };

  render() {
    const {
      chartConfig,
      chartQuery,
      symbolQuery,
      symbol,
      accountUuid,
    } = this.props;

    const { chartNextTickItem } = this.state;

    const chartData = (chartQuery.data?.tradingEngineSymbolPrices || []).map(this.addGroupSpread);

    const isLoading = !symbol || !accountUuid || chartQuery.loading || symbolQuery.loading;

    return (
      <div className={classNames('SymbolChart', { 'SymbolChart--loading': isLoading })}>
        {/* Subscribe to symbol prices stream */}
        <SymbolPricesStream
          symbol={symbol}
          onNotify={this.handleSymbolsPricesTick}
        />

        <Choose>
          <When condition={isLoading}>
            <SymbolChartIcon className="SymbolChart__icon" />
          </When>
          <Otherwise>
            <Fragment>
              <div className="SymbolChart__label">{symbol}</div>
              <Chart
                chartData={chartData}
                chartNextTickItem={chartNextTickItem}
                chartConfig={chartConfig}
              />
            </Fragment>
          </Otherwise>
        </Choose>
      </div>
    );
  }
}

export default compose(
  withRequests({
    chartQuery: SymbolChartQuery,
    symbolQuery: SymbolQuery,
  }),
)(SymbolChart);
