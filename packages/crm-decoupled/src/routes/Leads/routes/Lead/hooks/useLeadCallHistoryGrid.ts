import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import { Sort, State } from 'types';
import {
  CallHistoryQueryQueryResult,
  CallHistoryQueryVariables,
} from '../graphql/__generated__/LeadCallHistoryQuery';

type Props = {
  callHistoryQuery: CallHistoryQueryQueryResult,
};

const useLeadCallHistoryGrid = (props: Props) => {
  const { callHistoryQuery } = props;

  const { data, loading } = callHistoryQuery;
  const { content = [], last = false, page = 0 } = data?.callHistory || {};

  const state = useLocation().state as State<CallHistoryQueryVariables['args']>;

  const navigate = useNavigate();

  // ===== Handlers ===== //
  const handlePageChanged = useHandlePageChanged({
    query: callHistoryQuery,
    page,
    path: 'page.from',
  });

  const handleSort = useCallback((sorts: Array<Sort>) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  }, [state]);

  return {
    content,
    loading,
    last,
    handlePageChanged,
    handleSort,
  };
};

export default useLeadCallHistoryGrid;
