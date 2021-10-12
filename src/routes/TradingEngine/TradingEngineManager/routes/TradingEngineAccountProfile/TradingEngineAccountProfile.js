import React, { PureComponent } from 'react';
import { Redirect, Switch, withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import Helmet from 'react-helmet';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import AccountProfileHeader from './components/AccountProfileHeader';
import AccountProfileStatus from './components/AccountProfileStatus';
import AccountProfileGroup from './components/AccountProfileGroup';
import AccountProfileLeverage from './components/AccountProfileLeverage';
import AccountProfileRegistered from './components/AccountProfileRegistered';
import AccountProfileStatistics from './components/AccountProfileStatistics';
import AccountProfileOrdersGrid from './routes/AccountProfileOrdersGrid';
import AccountProfileHistoryGrid from './routes/AccountProfileHistoryGrid';
import AccountProfilePendingOrdersGrid from './routes/AccountProfilePendingOrdersGrid';
import AccountProfileTransactionsGrid from './routes/AccountProfileTransactionsGrid';
import AccountProfileFeedGrid from './routes/AccountProfileFeedGrid';
import { accountProfileTabs } from './constants';
import TradingEngineAccountQuery from './graphql/TradingEngineAccountQuery';
import './TradingEngineAccountProfile.scss';

class TradingEngineAccountProfile extends PureComponent {
  static propTypes = {
    ...withStorage.propTypes,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      path: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
    accountQuery: PropTypes.query({
      tradingEngineAccount: PropTypes.tradingEngineAccount,
    }).isRequired,
  }

  componentDidMount() {
    const {
      storage,
      match: { params: { id } },
    } = this.props;

    // Save last opened account to storage to open it later by request
    storage.set('TE.lastOpenedAccountUuid', id);
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
            <AccountProfileStatus enable={account?.readOnly} accountUuid={account?.uuid} />
            <AccountProfileGroup group={account?.group} accountUuid={account?.uuid} />
            <AccountProfileLeverage leverage={account?.leverage} accountUuid={account?.uuid} />
            <AccountProfileRegistered registrationDate={account?.registrationDate} />
          </div>

          <AccountProfileStatistics uuid={account?.uuid} />
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
            <Route path={`${path}/feed`} component={AccountProfileFeedGrid} />
            <Redirect to={`${url}/orders`} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withStorage,
  withRequests({
    accountQuery: TradingEngineAccountQuery,
  }),
)(TradingEngineAccountProfile);
