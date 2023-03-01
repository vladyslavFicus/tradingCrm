import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { cloneDeep, set } from 'lodash';
import { Sorts, State, TableSelection } from 'types';
import Tabs from 'components/Tabs';
import { ipWhitelistTabs } from '../../constants';
import IpWhitelistHeader from './components/IpWhitelistHeader';
import IpWhitelistFilter from './components/IpWhitelistGridFilter';
import IpWhitelistGrid from './components/IpWhitelistGrid';
import { useIpWhitelistQuery, IpWhitelistQueryVariables } from './graphql/__generated__/IpWhitelistQuery';
import './IpWhitelistList.scss';

const IpWhitelistList = () => {
  const [selected, setSelected] = useState<TableSelection | null>(null);

  const { state } = useLocation<State<IpWhitelistQueryVariables['args']>>();

  const history = useHistory();

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
  const handleFetchMore = () => {
    if (!loading) {
      fetchMore({
        variables: set(cloneDeep(variables as IpWhitelistQueryVariables), 'args.page.from', page + 1),
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

  return (
    <div className="IpWhitelistList">
      <Tabs items={ipWhitelistTabs} className="IpWhitelistList__tabs" />

      <IpWhitelistHeader
        content={content}
        totalElements={totalElements}
        selected={selected}
        onRefetch={refetch}
      />

      <IpWhitelistFilter onRefetch={refetch} />

      <IpWhitelistGrid
        content={content}
        loading={loading}
        last={last}
        onRefetch={refetch}
        onFetchMore={handleFetchMore}
        onSort={handleSort}
        onSelect={setSelected}
      />
    </div>
  );
};

export default React.memo(IpWhitelistList);
