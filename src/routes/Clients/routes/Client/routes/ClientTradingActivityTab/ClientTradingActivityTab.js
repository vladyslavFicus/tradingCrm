import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import TabHeader from 'components/TabHeader';
import TradingActivityGridFilter from './components/TradingActivityGridFilter';
import TradingActivityGrid from './components/TradingActivityGrid';
import TradingActivityQuery from './graphql/TradingActivityQuery';
import './ClientTradingActivityTab.scss';

class ClientTradingActivityTab extends PureComponent {
  static propTypes = {
    tradingActivityQuery: PropTypes.query({
      tradingActivity: PropTypes.pageable(PropTypes.tradingActivity),
    }).isRequired,
  }

  componentDidMount() {
    EventEmitter.on(CLIENT_RELOAD, this.refetchTradingActivity);
  }

  componentWillUnmount() {
    EventEmitter.off(CLIENT_RELOAD, this.refetchTradingActivity);
  }

  refetchTradingActivity = () => this.props.tradingActivityQuery.refetch();

  render() {
    const { tradingActivityQuery } = this.props;

    return (
      <div className="ClientTradingActivityTab">
        <TabHeader
          title={I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.TRADING_ACTIVITY')}
          className="ClientTradingActivityTab__header"
        />

        <TradingActivityGridFilter handleRefetch={this.refetchTradingActivity} />
        <TradingActivityGrid tradingActivityQuery={tradingActivityQuery} />
      </div>
    );
  }
}

export default compose(
  withRequests({
    tradingActivityQuery: TradingActivityQuery,
  }),
)(ClientTradingActivityTab);
