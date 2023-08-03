import React from 'react';
import I18n from 'i18n-js';
import TabHeader from 'components/TabHeader';
import useLeadCallHistoryTab from 'routes/Leads/routes/Lead/hooks/useLeadCallHistoryTab';
import LeadCallHistoryGridFilter from './components/LeadCallHistoryGridFilter';
import LeadCallHistoryGrid from './components/LeadCallHistoryGrid';
import './LeadCallHistoryTab.scss';


const LeadCallHistoryTab = () => {
  const {
    callHistoryQuery,
  } = useLeadCallHistoryTab();

  return (
    <div className="LeadCallHistoryTab">
      <TabHeader
        title={I18n.t('LEAD_PROFILE.TABS.CALL_HISTORY')}
        className="LeadCallHistoryTab__header"
      />

      <LeadCallHistoryGridFilter onRefetch={callHistoryQuery.refetch} />
      <LeadCallHistoryGrid callHistoryQuery={callHistoryQuery} />
    </div>
  );
};

export default React.memo(LeadCallHistoryTab);
