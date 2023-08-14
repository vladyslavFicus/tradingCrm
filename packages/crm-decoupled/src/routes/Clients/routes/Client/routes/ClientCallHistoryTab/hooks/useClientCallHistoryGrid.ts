import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Types } from '@crm/common';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import {
  CallHistoryQueryQueryResult,
  CallHistoryQueryVariables,
} from '../graphql/__generated__/ClientCallHistoryQuery';

type Props = {
  callHistoryQuery: CallHistoryQueryQueryResult,
};

const useClientCallHistoryGrid = (props: Props) => {
  const { callHistoryQuery } = props;

  const { data, loading } = callHistoryQuery;
  const { content = [], last = false } = callHistoryQuery?.data?.callHistory || {};

  const state = useLocation().state as Types.State<CallHistoryQueryVariables['args']>;

  const navigate = useNavigate();

  // ===== Handlers ===== //
  const page = data?.callHistory?.page || 0;
  const handlePageChanged = useHandlePageChanged({
    query: callHistoryQuery,
    page,
    path: 'page.from',
  });

  const handleSort = useCallback((sorts: Types.Sort[]) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  }, [navigate, state]);

  return {
    content,
    loading,
    last,
    handleSort,
    handlePageChanged,
  };
};

export default useClientCallHistoryGrid;
