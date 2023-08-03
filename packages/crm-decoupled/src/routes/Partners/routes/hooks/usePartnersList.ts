import { useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { Sorts, State } from 'types';
import { Select } from 'types/table';
import { Partner } from '__generated__/types';
import { usePartnersQuery, PartnersQueryVariables } from '../graphql/__generated__/PartnersQuery';

type PartnersList = {
  totalElements: number,
  selectedUuids: Array<string>,
  selected: number,
  selectAll: boolean,
  content: Array<Partner>,
  loading: boolean,
  last: boolean,
  handleRefetch: () => void,
  handleFetchMore: () => void,
  handleSort: (sorts: Sorts) => void,
  handleSelect: (value: Select) => void,
};

const usePartnersList = (): PartnersList => {
  const [select, setSelect] = useState<Select>(null);

  const state = useLocation().state as State<PartnersQueryVariables>;

  const navigate = useNavigate();

  // ===== Requests ===== //
  const { data, loading, variables = {}, refetch, fetchMore } = usePartnersQuery({
    variables: {
      ...state?.filters as PartnersQueryVariables,
      page: {
        from: 0,
        size: 20,
        sorts: state?.sorts?.length ? state.sorts : undefined,
      },
    },
  });

  const { content = [], last = true, totalElements = 0, page = 0 } = data?.partners || {};

  const partnersUuids = content.map(({ uuid }) => uuid) || [];

  const selectedUuids = (select?.touched || []).map(item => partnersUuids[item]);

  // ===== Handlers ===== //
  const handleSelect = useCallback((value: Select) => {
    setSelect(value);
  }, []);

  const handleFetchMore = useCallback(() => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as PartnersQueryVariables), 'page.from', page + 1),
      });
    }
  }, [loading, page, variables]);

  const handleSort = useCallback((sorts: Sorts) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  }, [state]);

  const handleRefetch = useCallback(() => {
    select?.reset();

    refetch();
  }, [select]);

  return {
    totalElements,
    selectedUuids,
    selected: select?.selected || 0,
    selectAll: !!select?.all,
    content,
    loading,
    last,
    handleRefetch,
    handleFetchMore,
    handleSort,
    handleSelect,
  };
};

export default usePartnersList;
