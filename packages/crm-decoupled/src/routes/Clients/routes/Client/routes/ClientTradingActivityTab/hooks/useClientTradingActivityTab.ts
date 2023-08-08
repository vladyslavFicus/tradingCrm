import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { Utils } from '@crm/common';
import { State } from 'types';
import { Sort__Input as Sort, TradingActivity } from '__generated__/types';
import {
  useTradingActivityQuery,
  TradingActivityQueryVariables,
} from '../graphql/__generated__/TradingActivityQuery';

type UseClientTradingActivityTab = {
  profileUUID: string,
  loading: boolean,
  refetch: () => void,
  content: Array<TradingActivity>,
  last: boolean,
  handleSort: (sorts: Array<Sort>) => void,
  handleLoadMore: () => void,
  stateSorts: Array<Sort>,
};

const useClientTradingActivityTab = (): UseClientTradingActivityTab => {
  const profileUUID = useParams().id as string;

  const navigate = useNavigate();

  const state = useLocation().state as State<TradingActivityQueryVariables>;
  const stateSorts = state?.sorts || [];

  // ===== Requests ===== //
  const { data, loading, variables = {}, refetch, fetchMore } = useTradingActivityQuery({
    variables: {
      profileUUID,
      tradeType: 'LIVE',
      ...state?.filters,
      page: 0,
      limit: 20,
    } as TradingActivityQueryVariables,
  });

  const { content = [], last = true, number = 0 } = data?.tradingActivity || {};

  // ===== Handlers ===== //
  const handleLoadMore = useCallback(() => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables), 'page', number + 1),
      });
    }
  }, [loading, fetchMore, variables, number]);

  const handleSort = useCallback((sorts: Array<Sort>) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  }, [navigate, state]);

  // ===== Effects ===== //
  useEffect(() => {
    Utils.EventEmitter.on(Utils.CLIENT_RELOAD, refetch);

    return () => {
      Utils.EventEmitter.off(Utils.CLIENT_RELOAD, refetch);
    };
  }, []);

  return {
    profileUUID,
    loading,
    refetch,
    content,
    last,
    handleSort,
    handleLoadMore,
    stateSorts,
  };
};

export default useClientTradingActivityTab;
