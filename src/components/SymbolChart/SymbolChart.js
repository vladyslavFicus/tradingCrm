import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withLazyStreams } from 'rsocket';
import PropTypes from 'constants/propTypes';
import ShortLoader from 'components/ShortLoader';
import Chart from './components/Chart';
import { ReactComponent as SymbolChartIcon } from './SymbolChartIcon.svg';
import TradingEngineSymbolChartQuery from './graphql/SymbolChartQuery';
import './SymbolChart.scss';

class SymbolChart extends PureComponent {
  static propTypes = {
    symbol: PropTypes.string,
    accountUuid: PropTypes.string,
    tradingEngineSymbolChartQuery: PropTypes.query({
      tradingEngineSymbolPrices: PropTypes.shape({
        name: PropTypes.string,
        ask: PropTypes.number.isRequired,
        bid: PropTypes.number.isRequired,
        time: PropTypes.string.isRequired,
      }),
    }).isRequired,
    chartStreamRequest: PropTypes.func.isRequired,
    chartConfig: PropTypes.object,
  };

  static defaultProps = {
    chartConfig: {},
    symbol: '',
    accountUuid: '',
  };

  state = {
    chartNextTickItem: null,
  };

  componentDidMount() {
    const { symbol, accountUuid } = this.props;

    if (symbol && accountUuid) {
      this.initializationStream();
    }
  }

  componentDidUpdate({ symbol: prevSymbol }) {
    const { symbol, accountUuid } = this.props;

    if (accountUuid && (prevSymbol !== symbol)) {
      this.initializationStream(symbol);
    }
  }

  initializationStream = () => {
    const { symbol, chartStreamRequest, accountUuid } = this.props;

    const chartSubscription = chartStreamRequest({
      data: { symbol, accountUuid },
    });

    chartSubscription.onNext(({ data }) => {
      this.setState({ chartNextTickItem: data });
    });
  }

  render() {
    const { chartConfig, tradingEngineSymbolChartQuery, symbol, accountUuid } = this.props;
    const { chartNextTickItem } = this.state;
    const { loading } = tradingEngineSymbolChartQuery;

    const chartData = tradingEngineSymbolChartQuery.data?.tradingEngineSymbolPrices || [];

    return (
      <div className="SymbolChart">
        <Choose>
          <When condition={!symbol || !accountUuid}>
            <SymbolChartIcon className="SymbolChart__icon" />
          </When>
          <When condition={loading}>
            <ShortLoader />
          </When>
          <Otherwise>
            <Chart
              chartData={chartData}
              chartNextTickItem={chartNextTickItem}
              {...chartConfig}
            />
          </Otherwise>
        </Choose>
      </div>
    );
  }
}

export default compose(
  withRequests({
    tradingEngineSymbolChartQuery: TradingEngineSymbolChartQuery,
  }),
  withLazyStreams({
    chartStreamRequest: {
      route: 'streamPrices',
    },
  }),
)(SymbolChart);
