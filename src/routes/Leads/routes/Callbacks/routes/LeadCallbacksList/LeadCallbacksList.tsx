import React, { useEffect } from 'react';
import I18n from 'i18n-js';
import { useLocation } from 'react-router-dom';
import { State } from 'types';
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

  const queryVariables = {
    ...rest,
    ...fieldTimeZoneOffset('callbackTimeFrom', callbackTimeFrom, timeZone),
    ...fieldTimeZoneOffset('callbackTimeTo', callbackTimeTo, timeZone),
    limit: 20,
    page: 0,
  };

  // ===== Requests ===== //
  const leadCallbacksListQuery = useLeadCallbacksListQuery({
    variables: queryVariables as LeadCallbacksListQueryVariables,
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
