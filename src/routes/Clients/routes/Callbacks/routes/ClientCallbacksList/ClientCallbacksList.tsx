import React from 'react';
import I18n from 'i18n-js';
import { useLocation } from 'react-router-dom';
import { State } from 'types';
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

  const clientCallbacks = useClientCallbacksListQuery({
    variables: {
      ...state?.filters as ClientCallbacksListQueryVariables,
      limit: 20,
      page: 0,
    },
  });

  const totalElements = clientCallbacks.data?.clientCallbacks.totalElements;

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

      <CallbacksGridFilter handleRefetch={clientCallbacks?.refetch} />
      <CallbacksGrid callbacksData={clientCallbacks} />
    </div>
  );
};

export default React.memo(CallbacksList);
