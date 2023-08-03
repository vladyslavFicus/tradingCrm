import { useLocation, useParams } from 'react-router-dom';
import { State } from 'types';
import { CallHistoryQueryVariables, useCallHistoryQuery } from '../graphql/__generated__/ClientCallHistoryQuery';

const useClientCallHistoryTab = () => {
  const uuid = useParams().id as string;

  const state = useLocation().state as State<CallHistoryQueryVariables['args']>;

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

  return { callHistoryQuery };
};

export default useClientCallHistoryTab;
