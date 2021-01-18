import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import TabHeader from 'components/TabHeader';
import TradingActivityGridFilter from './components/TradingActivityGridFilter';
import TradingActivityGrid from './components/TradingActivityGrid';
import TradingActivityQuery from './graphql/TradingActivityQuery';
import './ClientTradingActivity.scss';

class TradingActivity extends PureComponent {
  static propTypes = {
    tradingActivityQuery: PropTypes.query({
      tradingActivity: PropTypes.pageable(PropTypes.tradingActivity),
    }).isRequired,
  }

  componentDidMount() {
    EventEmitter.on(CLIENT_RELOAD, this.onProfileEvent);
  }

  componentWillUnmount() {
    EventEmitter.off(CLIENT_RELOAD, this.onProfileEvent);
  }

  onProfileEvent = () => {
    this.props.tradingActivityQuery.refetch();
  };

  render() {
    const { tradingActivityQuery } = this.props;

    return (
      <div className="ClientTradingActivity">
        <TabHeader
          title={I18n.t('CONSTANTS.TRANSACTIONS.ROUTES.TRADING_ACTIVITY')}
          className="ClientTradingActivity__header"
        />

        <TradingActivityGridFilter handleRefetch={tradingActivityQuery.refetch} />
        <TradingActivityGrid tradingActivityQuery={tradingActivityQuery} />
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    tradingActivityQuery: TradingActivityQuery,
  }),
)(TradingActivity);
