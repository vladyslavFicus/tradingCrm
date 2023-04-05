import React, { useEffect } from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { State } from 'types';
import { Sort__Input as Sort } from '__generated__/types';
import EventEmitter, { CLIENT_CALLBACK_RELOAD } from 'utils/EventEmitter';
import { Link } from 'components/Link';
import { fieldTimeZoneOffset } from 'utils/timeZoneOffset';
import ClientCallbacksGridFilter from './components/ClientCallbacksGridFilter';
import ClientCallbacksGrid from './components/ClientCallbacksGrid';
import { FormValues } from './types';
import {
  useClientCallbacksListQuery,
  ClientCallbacksListQueryVariables,
} from './graphql/__generated__/ClientCallbacksListQuery';
import './ClientCallbacksList.scss';

const CallbacksList = () => {
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
  const clientCallbacksListQuery = useClientCallbacksListQuery({
    variables: queryVariables as ClientCallbacksListQueryVariables,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    context: { batch: false },
  });

  const totalElements = clientCallbacksListQuery.data?.clientCallbacks.totalElements;

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_CALLBACK_RELOAD, clientCallbacksListQuery.refetch);

    return () => {
      EventEmitter.off(CLIENT_CALLBACK_RELOAD, clientCallbacksListQuery.refetch);
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
    <div className="ClientCallbacksList">
      <div className="ClientCallbacksList__header">
        <div className="ClientCallbacksList__title">
          <If condition={!!totalElements}>
            <strong>{totalElements} </strong>
          </If>

          {I18n.t('CALLBACKS.CALLBACKS')}
        </div>

        <div className="ClientCallbacksList__calendar">
          <Link to="/clients/callbacks/calendar">
            <i className="fa fa-calendar" />
          </Link>
        </div>
      </div>

      <ClientCallbacksGridFilter onRefetch={clientCallbacksListQuery?.refetch} />

      <ClientCallbacksGrid
        sorts={state?.sorts || []}
        onSort={handleSort}
        clientCallbacksListQuery={clientCallbacksListQuery}
      />
    </div>
  );
};

export default React.memo(CallbacksList);
