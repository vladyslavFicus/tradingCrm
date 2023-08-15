import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Helmet from 'react-helmet';
import { ShortLoader } from 'components';
import Tabs from 'components/Tabs';
import HideDetails from 'components/HideDetails';
import NotFound from 'routes/NotFound';
import useClient from 'routes/Clients/routes/Client/hooks/useClient';
import { clientTabs } from 'routes/Clients/routes/Client/constants';
import ClientProfileTab from 'routes/Clients/routes/Client/routes/ClientProfileTab';
import ClientPaymentsTab from 'routes/Clients/routes/Client/routes/ClientPaymentsTab';
import ClientTradingActivityTab from 'routes/Clients/routes/Client/routes/ClientTradingActivityTab';
import ClientTradingAccountsTab from 'routes/Clients/routes/Client/routes/ClientTradingAccountsTab';
import ClientCallbacksTab from 'routes/Clients/routes/Client/routes/ClientCallbacksTab';
import ClientCallHistoryTab from 'routes/Clients/routes/Client/routes/ClientCallHistoryTab';
import ClientNotesTab from 'routes/Clients/routes/Client/routes/ClientNotesTab';
import ClientFilesTab from 'routes/Clients/routes/Client/routes/ClientFilesTab';
import ClientFeedsTab from 'routes/Clients/routes/Client/routes/ClientFeedsTab';
import ClientReferralsTab from 'routes/Clients/routes/Client/routes/ClientReferralsTab';
import ClientHeader from 'routes/Clients/routes/Client/components/ClientHeader';
import ClientAccountStatus from 'routes/Clients/routes/Client/components/ClientAccountStatus';
import ClientBalance from 'routes/Clients/routes/Client/components/ClientBalance';
import ClientLastLogin from 'routes/Clients/routes/Client/components/ClientLastLogin';
import ClientLastActivity from 'routes/Clients/routes/Client/components/ClientLastActivity';
import ClientRegistrationInfo from 'routes/Clients/routes/Client/components/ClientRegistrationInfo';
import ClientReferrals from 'routes/Clients/routes/Client/components/ClientReferrals';
import ClientPersonalInfo from 'routes/Clients/routes/Client/components/ClientPersonalInfo';
import ClientAcquisitionStatus from 'routes/Clients/routes/Client/components/ClientAcquisitionStatus';
import ClientLastIps from 'routes/Clients/routes/Client/components/ClientLastIps';
import ClientPinnedNotes from 'routes/Clients/routes/Client/components/ClientPinnedNotes';
import ClientDepositSwitcher from 'routes/Clients/routes/Client/components/ClientDepositSwitcher';
import './Client.scss';

const Client = () => {
  const {
    allowReferrerStatistics,
    isDisplayClientDepositSwitcher,
    profile,
    loading,
    refetch,
  } = useClient();

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
        <If condition={isDisplayClientDepositSwitcher}>
          <ClientDepositSwitcher profile={profile} />
        </If>

        <HideDetails>
          <div className="Client__details">
            <ClientPersonalInfo profile={profile} />

            <ClientAcquisitionStatus profile={profile} onRefetch={refetch} />

            <ClientLastIps profile={profile} />

            <ClientPinnedNotes clientUuid={uuid} />
          </div>
        </HideDetails>
      </div>

      <Tabs items={clientTabs} />

      <div className="Client__tab-content">
        <Suspense fallback={null}>
          <Routes>
            <Route path="profile" element={<ClientProfileTab />} />
            <Route path="payments" element={<ClientPaymentsTab />} />
            <Route path="trading-activity" element={<ClientTradingActivityTab />} />
            <Route path="accounts" element={<ClientTradingAccountsTab />} />
            <Route path="callbacks" element={<ClientCallbacksTab />} />
            <Route path="call-history" element={<ClientCallHistoryTab />} />
            <Route path="notes" element={<ClientNotesTab />} />
            <Route path="files" element={<ClientFilesTab />} />
            <Route path="feed" element={<ClientFeedsTab />} />
            <Route path="referrals" element={<ClientReferralsTab />} />
            <Route path="*" element={<Navigate replace to="profile" />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(Client);
