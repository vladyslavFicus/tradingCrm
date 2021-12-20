import React from 'react';
import I18n from 'i18n-js';
import { useHistory, useLocation } from 'react-router-dom';
import { State, Sort } from 'types';
import { Table, Column } from 'components/Table';
import { EditButton, Button } from 'components/UI';
import { GroupsQueryResult, Group, GroupSecurities, GroupFilters } from '../../types/group';
import './GroupsGrid.scss';

interface Props {
  groupsListQuery: GroupsQueryResult,
}

const renderName = ({ groupName }: Group) => (
  <div className="GroupsGrid__cell-primary">
    {groupName}
  </div>
);

const renderCompany = ({ brand }: Group) => (
  <div className="GroupsGrid__cell-primary">
    {brand}
  </div>
);

const renderMCSO = ({ marginCallLevel, stopoutLevel }: Group) => (
  <div className="GroupsGrid__cell-primary">
    {`${marginCallLevel} / ${stopoutLevel} %`}
  </div>
);

const renderSecurities = ({ groupSecurities = [] }: Group) => {
  const securities = groupSecurities
    .map(({ security }: GroupSecurities) => security.name)
    .join(', ');

  return (
    <div>{securities}</div>
  );
};

const renderActions = (handleEditClick: Function, handleDeleteClick: Function) => (
  <>
    <EditButton
      onClick={handleEditClick}
      className="GroupsGrid__edit-button"
    />
    <Button
      transparent
      onClick={handleDeleteClick}
    >
      <i className="fa fa-trash btn-transparent color-danger" />
    </Button>
  </>
);

const GroupsGrid = ({ groupsListQuery }: Props) => {
  const { state } = useLocation<State<GroupFilters>>();
  const history = useHistory();

  const { loading, data: groupsListData } = groupsListQuery || {};
  const {
    content = [],
    totalElements,
    last = true,
    number = 0,
  } = groupsListData?.tradingEngineAdminGroups || {};

  const handleDeleteClick = () => {
    // TODO: handleDelete
  };

  const handleEditClick = () => {
    // TODO: handleEdit
  };

  const handleSort = (sorts: Sort) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  const handlePageChanged = () => {
    const { loadMore, variables } = groupsListQuery;

    const filters = state?.filters || {};
    const size = variables?.args?.page?.size;
    const sorts = state?.sorts;

    loadMore({
      args: {
        ...filters,
        page: {
          from: number + 1,
          size,
          sorts,
        },
      },
    });
  };

  return (
    <div className="GroupsGrid">
      <Table
        stickyFromTop={123}
        items={content}
        loading={loading}
        hasMore={!last}
        sorts={state?.sorts}
        onSort={handleSort}
        onMore={handlePageChanged}
        totalCount={totalElements}
      >
        <Column
          width={200}
          sortBy="groupName"
          header={I18n.t('TRADING_ENGINE.GROUPS.GRID.NAME')}
          render={renderName}
        />
        <Column
          width={300}
          header={I18n.t('TRADING_ENGINE.GROUPS.GRID.COMPANY')}
          render={renderCompany}
        />
        <Column
          width={100}
          header={I18n.t('TRADING_ENGINE.GROUPS.GRID.MC_SO')}
          render={renderMCSO}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.GROUPS.GRID.SECURITIES')}
          render={renderSecurities}
        />
        <Column
          width={120}
          header={I18n.t('TRADING_ENGINE.GROUPS.GRID.ACTIONS')}
          render={() => renderActions(
            handleEditClick,
            handleDeleteClick,
          )}
        />
      </Table>
    </div>
  );
};

export default React.memo(GroupsGrid);
