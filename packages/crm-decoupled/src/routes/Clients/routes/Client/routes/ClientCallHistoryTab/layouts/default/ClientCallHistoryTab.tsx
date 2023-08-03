import React from 'react';
import I18n from 'i18n-js';
import TabHeader from 'components/TabHeader';
import useClientCallHistoryTab
  from 'routes/Clients/routes/Client/routes/ClientCallHistoryTab/hooks/useClientCallHistoryTab';
import ClientCallHistoryGridFilter from './components/ClientCallHistoryGridFilter';
import ClientCallHistoryGrid from './components/ClientCallHistoryGrid';
import './ClientCallHistoryTab.scss';

const ClientCallHistoryTab = () => {
  const { callHistoryQuery } = useClientCallHistoryTab();

  return (
    <div className="ClientCallHistoryTab">
      <TabHeader
        title={I18n.t('CLIENT_PROFILE.TABS.CALL_HISTORY')}
        className="ClientCallHistoryTab__header"
      />

      <ClientCallHistoryGridFilter onRefetch={callHistoryQuery.refetch} />

      <ClientCallHistoryGrid callHistoryQuery={callHistoryQuery} />
    </div>
  );
};

export default React.memo(ClientCallHistoryTab);
