import React from 'react';
import I18n from 'i18n-js';
import { RouteComponentProps, useLocation } from 'react-router-dom';
import { State } from 'types';
import TabHeader from 'components/TabHeader';
import LeadCallHistoryGridFilter from './components/LeadCallHistoryGridFilter';
import LeadCallHistoryGrid from './components/LeadCallHistoryGrid';
import { CallHistoryQueryVariables, useCallHistoryQuery } from './graphql/__generated__/LeadCallHistoryQuery';
import './LeadCallHistoryTab.scss';

type Props = RouteComponentProps<{
  id: string,
}>;

const LeadCallHistoryTab = (props: Props) => {
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
    <div className="LeadCallHistoryTab">
      <TabHeader
        title={I18n.t('LEAD_PROFILE.TABS.CALL_HISTORY')}
        className="LeadCallHistoryTab__header"
      />

      <LeadCallHistoryGridFilter onRefetch={callHistoryQuery.refetch} />
      <LeadCallHistoryGrid callHistoryQuery={callHistoryQuery} />
    </div>
  );
};

export default React.memo(LeadCallHistoryTab);
