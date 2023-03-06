import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { Sorts, State } from 'types';
import { Select } from 'types/table';
import PartnersHeader from './components/PartnersHeader/PartnersHeader';
import PartnersGridFilter from './components/PartnersGridFilter';
import PartnersGrid from './components/PartnersGrid';
import { usePartnersQuery, PartnersQueryVariables } from './graphql/__generated__/PartnersQuery';
import './PartnersList.scss';

const PartnersList = () => {
  const [select, setSelect] = useState<Select>(null);

  const { state } = useLocation<State<PartnersQueryVariables>>();

  const history = useHistory();

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

  const selectedUuids = select?.all
    ? partnersUuids
    : (select?.touched || []).map(item => partnersUuids[item]);

  // ===== Handlers ===== //
  const handleSelect = (value: Select) => {
    setSelect(value);
  };

  const handleFetchMore = () => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as PartnersQueryVariables), 'page.from', page + 1),
      });
    }
  };

  const handleSort = (sorts: Sorts) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  const handleRefetch = () => {
    select?.reset();

    refetch();
  };

  return (
    <div className="PartnersList">
      <PartnersHeader
        totalElements={totalElements}
        selected={select?.selected || 0}
        onRefetch={handleRefetch}
        uuids={selectedUuids}
      />

      <PartnersGridFilter onRefetch={handleRefetch} />

      <PartnersGrid
        content={content}
        loading={loading}
        totalElements={totalElements}
        last={last}
        onFetchMore={handleFetchMore}
        onSort={handleSort}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default React.memo(PartnersList);
