import React from 'react';
import { useLocation } from 'react-router-dom';
import { Types } from '@crm/common';
import Tabs from 'components/Tabs';
import { tradingEngineTabs } from '../../../../constants';
import GroupsHeader from './components/GroupsHeader';
import GroupsGrid from './components/GroupsGrid';
import GroupsGridFilters from './components/GroupsGridFilters';
import { GroupsQueryVariables, useGroupsQuery } from './graphql/__generated__/GroupsQuery';
import './GroupsList.scss';

const GroupsList = () => {
  const state = useLocation().state as Types.State<GroupsQueryVariables>;

  const groupsListQuery = useGroupsQuery({
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

  return (
    <div className="GroupsList">
      <Tabs items={tradingEngineTabs} />

      <GroupsHeader groupsListQuery={groupsListQuery} />
      <GroupsGridFilters groupsListQuery={groupsListQuery} />
      <GroupsGrid groupsListQuery={groupsListQuery} />
    </div>
  );
};

export default React.memo(GroupsList);
