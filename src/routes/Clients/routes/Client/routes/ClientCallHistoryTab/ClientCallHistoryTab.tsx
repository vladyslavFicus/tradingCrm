import React from 'react';
import I18n from 'i18n-js';
import { RouteComponentProps, useLocation } from 'react-router-dom';
import { State } from 'types';
import TabHeader from 'components/TabHeader';
import ClientCallHistoryGridFilter from './components/ClientCallHistoryGridFilter';
import ClientCallHistoryGrid from './components/ClientCallHistoryGrid';
import { CallHistoryQueryVariables, useCallHistoryQuery } from './graphql/__generated__/ClientCallHistoryQuery';
import './ClientCallHistoryTab.scss';

type Props = RouteComponentProps<{
  id: string,
}>;

const ClientCallHistoryTab = (props: Props) => {
  const { match: { params: { id: uuid } } } = props;

  const { state } = useLocation<State<CallHistoryQueryVariables['args']>>();

  // ===== Requests ===== //
  const callHistoryQuery = useCallHistoryQuery({
    variables: {
      uuid,
      args: {
        ...state?.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
  });

  return (
    <div className="ClientCallHistoryTab">
      <TabHeader
        title={I18n.t('CLIENT_PROFILE.TABS.CALL_HISTORY')}
        className="ClientCallHistoryTab__header"
      />

      <ClientCallHistoryGridFilter onRefetch={callHistoryQuery.refetch} />
      <ClientCallHistoryGrid callHistoryQuery={callHistoryQuery} />
    </div>
  );
};

export default React.memo(ClientCallHistoryTab);
