import React, { PureComponent } from 'react';
import { Redirect, Switch, withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import Helmet from 'react-helmet';
import PropTypes from 'constants/propTypes';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import AccountProfileHeader from './components/AccountProfileHeader';
import AccountProfileStatus from './components/AccountProfileStatus';
import AccountProfileGroup from './components/AccountProfileGroup';
import AccountProfileLeverage from './components/AccountProfileLeverage';
import AccountProfileRegistered from './components/AccountProfileRegistered';
import AccountProfileOrdersGrid from './routes/AccountProfileOrdersGrid';
import AccountProfileHistoryGrid from './routes/AccountProfileHistoryGrid';
import AccountProfilePendingOrdersGrid from './routes/AccountProfilePendingOrdersGrid';
import AccountProfileTransactionsGrid from './routes/AccountProfileTransactionsGrid';
import { accountProfileTabs } from './constants';
import TradingEngineAccountQuery from './graphql/TradingEngineAccountQuery';
import './TradingEngineAccountProfile.scss';

class TradingEngineAccountProfile extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
    accountQuery: PropTypes.query({
      tradingEngineAccount: PropTypes.pageable(PropTypes.tradingAccountsItem),
    }).isRequired,
  }

  render() {
    const {
      match: { path, url },
      accountQuery,
    } = this.props;

    const account = accountQuery.data?.tradingEngineAccount || {};

    return (
      <div className="TradingEngineAccountProfile">
        <Helmet title="Account profile" />

        <AccountProfileHeader account={account} />

        <div className="TradingEngineAccountProfile__content">
          <div className="TradingEngineAccountProfile__info">
            <AccountProfileStatus enable={account?.enable} />
            <AccountProfileGroup group={account?.group} />
            <AccountProfileLeverage leverage={account?.leverage} />
            <AccountProfileRegistered registrationDate={account?.registrationDate} />
          </div>
        </div>

        <Tabs items={accountProfileTabs} />

        <div className="TradingEngineAccountProfile__tab-content">
          <Switch>
            <Route
              path={`${path}/orders`}
              render={() => <AccountProfileOrdersGrid orderStatuses={['OPEN']} />}
            />
            <Route
              path={`${path}/pending-orders`}
              render={() => <AccountProfilePendingOrdersGrid orderStatuses={['PENDING']} />}
            />
            <Route
              path={`${path}/transactions`}
              render={() => <AccountProfileTransactionsGrid />}
            />
            <Route path={`${path}/history`} component={AccountProfileHistoryGrid} />
            <Redirect to={`${url}/orders`} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    accountQuery: TradingEngineAccountQuery,
  }),
)(TradingEngineAccountProfile);
