import React, { useEffect } from 'react';
import I18n from 'i18n-js';
import { Redirect, Switch, useParams, useRouteMatch } from 'react-router-dom';
import compose from 'compose-function';
import Helmet from 'react-helmet';
import { withStorage } from 'providers/StorageProvider';
import { Storage } from 'types/storage';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import ShortLoader from 'components/ShortLoader';
import AccountProfileHeader from './components/AccountProfileHeader';
import AccountProfileStatus from './components/AccountProfileStatus';
import AccountProfileGroup from './components/AccountProfileGroup';
import AccountProfileCurrency from './components/AccountProfileCurrency';
import AccountProfileLeverage from './components/AccountProfileLeverage';
import AccountProfileRegistered from './components/AccountProfileRegistered';
import AccountProfileStatistics from './components/AccountProfileStatistics';
import InstantOrder from './components/AccountProfileInstantOrder';
import AccountProfileOrdersGrid from './routes/AccountProfileOrdersGrid';
import AccountProfileTransactionsGrid from './routes/AccountProfileTransactionsGrid';
import AccountProfileFeedGrid from './routes/AccountProfileFeedGrid';
import AccountProfileHistoryGrid from './routes/AccountProfileHistoryGrid';
import { accountProfileTabs } from './constants';
import { useAccountQuery, AccountQuery } from './graphql/__generated__/AccountQuery';
import './AccountProfile.scss';

export type Account = AccountQuery['tradingEngine']['account'];

type Props = {
  storage: Storage,
}

const AccountProfile = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  const { path, url } = useRouteMatch();
  const accountQuery = useAccountQuery({ variables: { identifier: id } });
  const account = accountQuery.data?.tradingEngine.account as Account;

  useEffect(() => {
    // Save last opened account to storage to open it later by request
    props.storage.set('TE.lastOpenedAccountUuid', id);
  });

  return (
    <div className="AccountProfile">
      <Helmet title={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.TITLE')} />

      <Choose>
        <When condition={accountQuery.loading}>
          <ShortLoader />
        </When>
        <Otherwise>
          {/* Instant order button on whole account profile page */}
          <InstantOrder accountUuid={account.uuid} />

          <AccountProfileHeader account={account} handleRefetch={accountQuery.refetch} />

          <div className="AccountProfile__content">
            <div className="AccountProfile__info">
              <AccountProfileStatus account={account} />
              <AccountProfileGroup account={account} />
              <AccountProfileCurrency account={account} />
              <AccountProfileLeverage account={account} />
              <AccountProfileRegistered account={account} />
            </div>

            <AccountProfileStatistics account={account} />
          </div>

          <Tabs items={accountProfileTabs} />

          <div className="AccountProfile__tab-content">
            <Switch>
              <Route
                path={`${path}/orders`}
                render={() => <AccountProfileOrdersGrid orderStatuses={['OPEN']} />}
              />
              <Route
                path={`${path}/pending-orders`}
                render={() => <AccountProfileOrdersGrid orderStatuses={['PENDING']} />}
              />
              <Route
                path={`${path}/transactions`}
                render={() => <AccountProfileTransactionsGrid />}
              />
              <Route
                path={`${path}/history`}
                render={() => <AccountProfileHistoryGrid />}
              />
              <Route path={`${path}/feed`} component={AccountProfileFeedGrid} />
              <Redirect to={`${url}/orders`} />
            </Switch>
          </div>
        </Otherwise>
      </Choose>
    </div>
  );
};

export default compose(
  React.memo,
  withStorage,
)(AccountProfile);
