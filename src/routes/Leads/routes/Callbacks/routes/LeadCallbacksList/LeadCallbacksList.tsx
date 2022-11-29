import React, { useEffect } from 'react';
import I18n from 'i18n-js';
import { useLocation } from 'react-router-dom';
import { State } from 'types';
import EventEmitter, { LEAD_CALLBACK_RELOAD } from 'utils/EventEmitter';
import { Link } from 'components/Link';
import LeadCallbacksGridFilter from './components/LeadCallbacksGridFilter';
import LeadCallbacksGrid from './components/LeadCallbacksGrid';
import {
  LeadCallbacksListQueryVariables,
  useLeadCallbacksListQuery,
} from './graphql/__generated__/LeadCallbacksListQuery';
import './LeadCallbacksList.scss';

const LeadCallbacksList = () => {
  const { state } = useLocation<State<LeadCallbacksListQueryVariables>>();

  const leadCallbacksQuery = useLeadCallbacksListQuery({
    variables: {
      ...state?.filters as LeadCallbacksListQueryVariables,
      limit: 20,
      page: 0,
    },
  });

  useEffect(() => {
    EventEmitter.on(LEAD_CALLBACK_RELOAD, leadCallbacksQuery.refetch);

    return () => {
      EventEmitter.off(LEAD_CALLBACK_RELOAD, leadCallbacksQuery.refetch);
    };
  }, []);

  const totalElements = leadCallbacksQuery.data?.leadCallbacks.totalElements;

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

      <LeadCallbacksGridFilter handleRefetch={leadCallbacksQuery?.refetch} />
      <LeadCallbacksGrid callbacksData={leadCallbacksQuery} />
    </div>
  );
};

export default React.memo(LeadCallbacksList);
