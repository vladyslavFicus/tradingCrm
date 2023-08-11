import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { Types } from '@crm/common';
import { useIpWhitelistQuery, IpWhitelistQueryVariables } from '../graphql/__generated__/IpWhitelistQuery';

const useIpWhitelistList = () => {
  const [selected, setSelected] = useState<Types.TableSelection | null>(null);

  const state = useLocation().state as Types.State<IpWhitelistQueryVariables['args']>;

  const navigate = useNavigate();

  // ===== Requests ===== //
  const { data, loading, variables = {}, refetch, fetchMore } = useIpWhitelistQuery({
    variables: {
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

  const { content = [], last = true, totalElements = 0, page = 0 } = data?.ipWhitelistSearch || {};

  // ===== Handlers ===== //
  const handleFetchMore = useCallback(() => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as IpWhitelistQueryVariables), 'args.page.from', page + 1),
      });
    }
  }, [loading, variables, page]);

  const handleSort = useCallback((sorts: Types.Sorts) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  }, [state]);

  return {
    selected,
    setSelected,
    loading,
    refetch,
    content,
    last,
    totalElements,
    handleFetchMore,
    handleSort,
  };
};

export default useIpWhitelistList;
