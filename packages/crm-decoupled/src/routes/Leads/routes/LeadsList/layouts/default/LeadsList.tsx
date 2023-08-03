import React from 'react';
import useLeadsList from 'routes/Leads/routes/LeadsList/hooks/useLeadsList';
import LeadsHeader from './components/LeadsHeader';
import LeadsGridFilter from './components/LeadsGridFilter';
import LeadsGrid from './components/LeadsGrid';
import './LeadsList.scss';

const LeadsList = () => {
  const {
    state,
    select,
    leadsQuery,
    refetch,
    handleSelect,
  } = useLeadsList();

  return (
    <div className="LeadsList">
      <LeadsHeader leadsQuery={leadsQuery} select={select} />

      <LeadsGridFilter onRefetch={refetch} />

      <LeadsGrid
        leadsQuery={leadsQuery}
        onSelect={handleSelect}
        sorts={state?.sorts || []}
      />
    </div>
  );
};

export default React.memo(LeadsList);
