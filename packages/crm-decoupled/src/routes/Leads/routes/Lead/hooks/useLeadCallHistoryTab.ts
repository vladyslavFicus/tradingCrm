
import { useLocation, useParams } from 'react-router-dom';
import { Types } from '@crm/common';
import { CallHistoryQueryVariables, useCallHistoryQuery } from '../graphql/__generated__/LeadCallHistoryQuery';

const useLeadCallHistoryTab = () => {
  const uuid = useParams().id as string;

  const state = useLocation().state as Types.State<CallHistoryQueryVariables['args']>;

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

  return {
    callHistoryQuery,
  };
};

export default useLeadCallHistoryTab;
