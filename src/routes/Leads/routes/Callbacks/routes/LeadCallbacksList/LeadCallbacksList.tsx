import React, { useEffect } from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { State } from 'types';
import { Sort__Input as Sort } from '__generated__/types';
import EventEmitter, { LEAD_CALLBACK_RELOAD } from 'utils/EventEmitter';
import { Link } from 'components/Link';
import { fieldTimeZoneOffset } from 'utils/timeZoneOffset';
import LeadCallbacksGridFilter from './components/LeadCallbacksGridFilter';
import LeadCallbacksGrid from './components/LeadCallbacksGrid';
import { FormValues } from './types';
import {
  LeadCallbacksListQueryVariables,
  useLeadCallbacksListQuery,
} from './graphql/__generated__/LeadCallbacksListQuery';
import './LeadCallbacksList.scss';

const LeadCallbacksList = () => {
  const { state } = useLocation<State<FormValues>>();
  const { timeZone, callbackTimeFrom, callbackTimeTo, ...rest } = state?.filters || {} as FormValues;

  const history = useHistory();

  const queryVariables = {
    ...rest,
    ...fieldTimeZoneOffset('callbackTimeFrom', callbackTimeFrom, timeZone),
    ...fieldTimeZoneOffset('callbackTimeTo', callbackTimeTo, timeZone),
    page: {
      from: 0,
      size: 20,
      sorts: state?.sorts,
    },
  };

  // ===== Requests ===== //
  const leadCallbacksListQuery = useLeadCallbacksListQuery({
    variables: queryVariables as LeadCallbacksListQueryVariables,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: { batch: false },
  });

  const totalElements = leadCallbacksListQuery.data?.leadCallbacks.totalElements;

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(LEAD_CALLBACK_RELOAD, leadCallbacksListQuery.refetch);

    return () => {
      EventEmitter.off(LEAD_CALLBACK_RELOAD, leadCallbacksListQuery.refetch);
    };
  }, []);

  // ===== Handlers ===== //
  const handleSort = (sorts: Array<Sort>) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

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

      <LeadCallbacksGrid
        sorts={state?.sorts || []}
        onSort={handleSort}
        leadCallbacksListQuery={leadCallbacksListQuery}
      />
    </div>
  );
};

export default React.memo(LeadCallbacksList);
