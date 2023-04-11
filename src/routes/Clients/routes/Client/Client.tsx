import React, { Suspense, useEffect } from 'react';
import { Redirect, Switch, RouteComponentProps, useParams } from 'react-router-dom';
import Helmet from 'react-helmet';
import Trackify from '@hrzn/trackify';
import EventEmitter, { ACQUISITION_STATUS_CHANGED, CLIENT_RELOAD } from 'utils/EventEmitter';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import Tabs from 'components/Tabs';
import HideDetails from 'components/HideDetails';
import { getBrand } from 'config';
import ShortLoader from 'components/ShortLoader';
import Route from 'components/Route';
import NotFound from 'routes/NotFound';
import ClientHeader from './components/ClientHeader';
import ClientAccountStatus from './components/ClientAccountStatus';
import ClientBalance from './components/ClientBalance';
import ClientLastLogin from './components/ClientLastLogin';
import ClientLastActivity from './components/ClientLastActivity';
import ClientRegistrationInfo from './components/ClientRegistrationInfo';
import ClientReferrals from './components/ClientReferrals';
import ClientPersonalInfo from './components/ClientPersonalInfo';
import ClientAcquisitionStatus from './components/ClientAcquisitionStatus';
import ClientLastIps from './components/ClientLastIps';
import ClientPinnedNotes from './components/ClientPinnedNotes';
import ClientProfileTab from './routes/ClientProfileTab';
import ClientPaymentsTab from './routes/ClientPaymentsTab';
import ClientTradingActivityTab from './routes/ClientTradingActivityTab';
import ClientTradingAccountsTab from './routes/ClientTradingAccountsTab';
import ClientCallbacksTab from './routes/ClientCallbacksTab';
import ClientCallHistoryTab from './routes/ClientCallHistoryTab';
import ClientNotesTab from './routes/ClientNotesTab';
import ClientFilesTab from './routes/ClientFilesTab';
import ClientFeedsTab from './routes/ClientFeedsTab';
import ClientReferralsTab from './routes/ClientReferralsTab';
import { clientTabs } from './constants';
import ClientDepositSwitcher from './components/ClientDepositSwitcher';
import { useClientQuery } from './graphql/__generated__/ClientQuery';
import './Client.scss';

const Client = ({ match: { path, url } }: RouteComponentProps) => {
  const { id: playerUUID } = useParams<{ id: string }>();

  const brand = getBrand();

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowDepositConfig = permission.allows(permissions.USER_PROFILE.DEPOSIT_ENABLED_CONFIG);
  const allowReferrerStatistics = permission.allows(permissions.USER_PROFILE.REFERRER_STATISTICS);

  // ===== Requests ===== //
  const { data, loading, refetch } = useClientQuery({ variables: { playerUUID }, errorPolicy: 'all' });
  const profile = data?.profile;

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, refetch);
    EventEmitter.on(ACQUISITION_STATUS_CHANGED, refetch);

    Trackify.page({ eventAction: 'PROFILE_OPENED', eventLabel: playerUUID });

    return () => {
      EventEmitter.off(CLIENT_RELOAD, refetch);
      EventEmitter.off(ACQUISITION_STATUS_CHANGED, refetch);
    };
  }, []);

  if (loading) {
    return <ShortLoader />;
  }

  if (!profile) {
    return <NotFound />;
  }

  const { uuid, lastName, firstName } = profile;

  return (
    <div className="Client">
      <Helmet title={`${firstName} ${lastName}`} />

      <ClientHeader profile={profile} />

      <div className="Client__content">
        <div className="Client__info">
          <ClientAccountStatus profile={profile} />

          <ClientBalance profile={profile} />

          <ClientLastLogin profile={profile} />

          <ClientLastActivity profile={profile} />

          <ClientRegistrationInfo profile={profile} />

          <If condition={allowReferrerStatistics}>
            <ClientReferrals clientUuid={uuid} />
          </If>
        </div>

        {/* Show "Can Deposit" switcher only in case when deposits disabled for brand without operator approval */}
        <If condition={allowDepositConfig && brand.profile.isDepositEnabled === false}>
          <ClientDepositSwitcher profile={profile} />
        </If>

        <HideDetails>
          <div className="Client__details">
            <ClientPersonalInfo profile={profile} />

            <ClientAcquisitionStatus profile={profile} />

            <ClientLastIps profile={profile} />

            <ClientPinnedNotes clientUuid={uuid} />
          </div>
        </HideDetails>
      </div>

      <Tabs items={clientTabs} />

      <div className="Client__tab-content">
        <Suspense fallback={null}>
          <Switch>
            <Route path={`${path}/profile`} component={() => <ClientProfileTab profile={profile} />} />
            <Route path={`${path}/payments`} component={ClientPaymentsTab} />
            <Route path={`${path}/trading-activity`} component={ClientTradingActivityTab} />
            <Route path={`${path}/accounts`} component={ClientTradingAccountsTab} />
            <Route path={`${path}/callbacks`} component={ClientCallbacksTab} />
            <Route path={`${path}/call-history`} component={ClientCallHistoryTab} />
            <Route path={`${path}/notes`} component={ClientNotesTab} />
            <Route path={`${path}/files`} component={ClientFilesTab} />
            <Route path={`${path}/feed`} component={ClientFeedsTab} />
            <Route path={`${path}/referrals`} component={ClientReferralsTab} />
            <Redirect to={`${url}/profile`} />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(Client);
