import React from 'react';
import I18n from 'i18n-js';
import { useLocation } from 'react-router-dom';
import { State } from 'types';
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

  const leadCallbacks = useLeadCallbacksListQuery({
    variables: {
      ...state?.filters as LeadCallbacksListQueryVariables,
      limit: 20,
      page: 0,
    },
  });

  return (
    <div className="LeadCallbacksList">
      <div className="LeadCallbacksList__header">
        <div className="LeadCallbacksList__title">
          <If condition={!!leadCallbacks.data?.leadCallbacks.totalElements}>
            <strong>{leadCallbacks.data?.leadCallbacks.totalElements} </strong>
          </If>
          {I18n.t('CALLBACKS.CALLBACKS')}
        </div>

        <div className="LeadCallbacksList__calendar">
          <Link to="/leads/callbacks/calendar">
            <i className="fa fa-calendar" />
          </Link>
        </div>
      </div>

      <LeadCallbacksGridFilter handleRefetch={leadCallbacks?.refetch} />
      <LeadCallbacksGrid callbacksData={leadCallbacks} />
    </div>
  );
};

export default React.memo(LeadCallbacksList);
