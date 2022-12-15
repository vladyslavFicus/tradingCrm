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

  // ===== Requests ===== //
  const leadCallbacksListQuery = useLeadCallbacksListQuery({
    variables: {
      ...state?.filters as LeadCallbacksListQueryVariables,
      limit: 20,
      page: 0,
    },
  });

  const totalElements = leadCallbacksListQuery.data?.leadCallbacks.totalElements;

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(LEAD_CALLBACK_RELOAD, leadCallbacksListQuery.refetch);

    return () => {
      EventEmitter.off(LEAD_CALLBACK_RELOAD, leadCallbacksListQuery.refetch);
    };
  }, []);

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

      <LeadCallbacksGridFilter onRefetch={leadCallbacksListQuery?.refetch} />
      <LeadCallbacksGrid leadCallbacksListQuery={leadCallbacksListQuery} />
    </div>
  );
};

export default React.memo(LeadCallbacksList);
