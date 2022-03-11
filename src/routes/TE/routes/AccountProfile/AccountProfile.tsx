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
import AccountProfileLeverage from './components/AccountProfileLeverage';
import AccountProfileRegistered from './components/AccountProfileRegistered';
import AccountProfileStatistics from './components/AccountProfileStatistics';
import AccountProfileOrdersGrid from './routes/AccountProfileOrdersGrid';
import AccountProfileTransactionsGrid from './routes/AccountProfileTransactionsGrid';
import AccountProfileFeedGrid from './routes/AccountProfileFeedGrid';
import AccountProfileHistoryGrid from './routes/AccountProfileHistoryGrid';
import { accountProfileTabs } from './constants';
import { useAccountQuery } from './graphql/__generated__/AccountQuery';
import './AccountProfile.scss';

type Props = {
  storage: Storage,
}

const AccountProfile = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  const { path, url } = useRouteMatch();
  const accountQuery = useAccountQuery({ variables: { identifier: id } });
  const account = accountQuery.data?.tradingEngine.account;

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
          <AccountProfileHeader account={account} handleRefetch={accountQuery.refetch} />

          <div className="AccountProfile__content">
            <div className="AccountProfile__info">
              <AccountProfileStatus enable={account?.readOnly} accountUuid={account?.uuid} />
              <AccountProfileGroup group={account?.group} accountUuid={account?.uuid} />
              <AccountProfileLeverage leverage={account?.leverage} accountUuid={account?.uuid} />
              <AccountProfileRegistered registrationDate={account?.registrationDate || ''} />
            </div>

            <AccountProfileStatistics uuid={account?.uuid || ''} />
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
