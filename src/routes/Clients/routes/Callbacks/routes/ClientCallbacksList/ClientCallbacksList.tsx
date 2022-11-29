import React, { useEffect } from 'react';
import I18n from 'i18n-js';
import { useLocation } from 'react-router-dom';
import { State } from 'types';
import EventEmitter, { CLIENT_CALLBACK_RELOAD } from 'utils/EventEmitter';
import { Link } from 'components/Link';
import CallbacksGridFilter from './components/ClientCallbacksGridFilter';
import CallbacksGrid from './components/ClientCallbacksGrid';
import {
  useClientCallbacksListQuery,
  ClientCallbacksListQueryVariables,
} from './graphql/__generated__/ClientCallbacksListQuery';
import './ClientCallbacksList.scss';

const CallbacksList = () => {
  const { state } = useLocation<State<ClientCallbacksListQueryVariables>>();

  const clientCallbacksQuery = useClientCallbacksListQuery({
    variables: {
      ...state?.filters as ClientCallbacksListQueryVariables,
      limit: 20,
      page: 0,
    },
  });

  const totalElements = clientCallbacksQuery.data?.clientCallbacks.totalElements;

  useEffect(() => {
    EventEmitter.on(CLIENT_CALLBACK_RELOAD, clientCallbacksQuery.refetch);

    return () => {
      EventEmitter.off(CLIENT_CALLBACK_RELOAD, clientCallbacksQuery.refetch);
    };
  }, []);

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

      <CallbacksGridFilter handleRefetch={clientCallbacksQuery?.refetch} />
      <CallbacksGrid callbacksData={clientCallbacksQuery} />
    </div>
  );
};

export default React.memo(CallbacksList);
