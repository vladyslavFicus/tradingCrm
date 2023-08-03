import React from 'react';
import I18n from 'i18n-js';
import Link from 'components/Link';
import useLeadCallbacksList from 'routes/Leads/routes/Callbacks/hooks/useLeadCallbacksList';
import LeadCallbacksGridFilter from './components/LeadCallbacksGridFilter';
import LeadCallbacksGrid from './components/LeadCallbacksGrid';
import './LeadCallbacksList.scss';

const LeadCallbacksList = () => {
  const {
    state,
    leadCallbacksListQuery,
    totalElements,
    refetch,
    handleSort,
  } = useLeadCallbacksList();

  return (
    <div className="LeadCallbacksList">
      <div className="LeadCallbacksList__header">
        <div className="LeadCallbacksList__title">
          <If condition={!!totalElements}>
            <strong>{totalElements} </strong>
          </If>

          {I18n.t('CALLBACKS.CALLBACKS')}
        </div>

        <div className="LeadCallbacksList__calendar">
          <Link to="/leads/callbacks/calendar">
            <i className="fa fa-calendar" />
          </Link>
        </div>
      </div>

      <LeadCallbacksGridFilter onRefetch={refetch} />

      <LeadCallbacksGrid
        sorts={state?.sorts || []}
        onSort={handleSort}
        leadCallbacksListQuery={leadCallbacksListQuery}
      />
    </div>
  );
};

export default React.memo(LeadCallbacksList);
