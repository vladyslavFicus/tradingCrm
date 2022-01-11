import React from 'react';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import Tabs from 'components/Tabs';
import TradingEngineGroupsHeader from './components/GroupsHeader';
import TradingEngineGroupsGrid from './components/GroupsGrid';
import TradingEngineGroupsGridFilters from './components/GroupsGridFilters';
import TradingEngineAdminGroupsQuery from './graphql/TradingEngineAdminGroupsQuery';
import { tradingEngineAdminTabs } from '../../../../constants';
import { GroupsQueryResult } from './types/group';
import './TradingEngineGroupsList.scss';

interface Props {
  groupsListQuery: GroupsQueryResult,
}

const TradingEngineGroupsList = ({ groupsListQuery }: Props) => (
  <div className="TradingEngineGroupsList">
    <Tabs items={tradingEngineAdminTabs} />

    <TradingEngineGroupsHeader groupsListQuery={groupsListQuery} />

    <TradingEngineGroupsGridFilters groupsListQuery={groupsListQuery} />

    <TradingEngineGroupsGrid groupsListQuery={groupsListQuery} />
  </div>
);

export default compose(
  React.memo,
  withRequests({
    groupsListQuery: TradingEngineAdminGroupsQuery,
  }),
)(TradingEngineGroupsList);
