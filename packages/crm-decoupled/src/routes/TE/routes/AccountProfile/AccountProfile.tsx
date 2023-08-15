import React, { useEffect } from 'react';
import I18n from 'i18n-js';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Helmet from 'react-helmet';
import { useStorage } from '@crm/common';
import { TradingEngine__OrderStatuses__Enum as OrderStatuses } from '__generated__/types';
import { ShortLoader } from 'components';
import Tabs from 'components/Tabs';
import AccountProfileStatus from './components/AccountProfileStatus';
import AccountProfileHeader from './components/AccountProfileHeader';
import AccountProfileGroup from './components/AccountProfileGroup';
import AccountProfileCurrency from './components/AccountProfileCurrency';
import AccountProfileLeverage from './components/AccountProfileLeverage';
import AccountProfileRegistered from './components/AccountProfileRegistered';
import AccountProfileCountry from './components/AccountProfileCountry';
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

const AccountProfile = () => {
  const id = useParams().id as string;

  const storage = useStorage();

  const accountQuery = useAccountQuery({ variables: { identifier: id } });
  const account = accountQuery.data?.tradingEngine.account as Account;

  useEffect(() => {
    // Save last opened account to storage to open it later by request
    storage.set('TE.lastOpenedAccountUuid', id);
  }, []);

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

          <AccountProfileHeader
            account={account}
            handleRefetch={accountQuery.refetch}
          />

          <div className="AccountProfile__content">
            <div className="AccountProfile__info">
              <AccountProfileStatus account={account} />
              <AccountProfileGroup account={account} />
              <AccountProfileCurrency account={account} />
              <AccountProfileLeverage account={account} />
              <AccountProfileRegistered account={account} />
              <AccountProfileCountry account={account} />
            </div>

            <AccountProfileStatistics account={account} />
          </div>

          <Tabs items={accountProfileTabs} />

          <div className="AccountProfile__tab-content">
            <Routes>
              <Route
                path="orders"
                element={<AccountProfileOrdersGrid orderStatus={OrderStatuses.OPEN} key="OPEN" showCloseButtonColumn />}
              />
              <Route
                path="pending-orders"
                element={<AccountProfileOrdersGrid orderStatus={OrderStatuses.PENDING} key="PENDING" />}
              />
              <Route path="transactions" element={<AccountProfileTransactionsGrid />} />
              <Route path="history" element={<AccountProfileHistoryGrid />} />
              <Route path="feed" element={<AccountProfileFeedGrid />} />
              <Route path="*" element={<Navigate replace to="orders" />} />
            </Routes>
          </div>
        </Otherwise>
      </Choose>
    </div>
  );
};

export default React.memo(AccountProfile);
