import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withRequests } from 'apollo';
import { MutationResult, MutationOptions } from 'react-apollo';
import { useHistory, useLocation } from 'react-router-dom';
import { withNotifications, withModals } from 'hoc';
import { State, Sort, Modal, LevelType, Notify } from 'types';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { EditButton, Button } from 'components/UI';
import { GroupsQueryResult, GroupList, GroupSecurities, GroupFilters } from '../../types/group';
import DeleteGroupMutation from '../../graphql/DeleteGroupMutation';
import './GroupsGrid.scss';

interface Props {
  groupsListQuery: GroupsQueryResult,
  notify: Notify,
  deleteGroup: (options: MutationOptions) => MutationResult<{ deleteGroup: null }>,
  modals: {
    confirmationModal: Modal,
  },
}

const GroupsGrid = ({
  groupsListQuery,
  modals: {
    confirmationModal,
  },
  deleteGroup,
  notify,
}: Props) => {
  const { state } = useLocation<State<GroupFilters>>();
  const history = useHistory();

  const { loading, data: groupsListData, refetch } = groupsListQuery || {};
  const {
    content = [],
    totalElements,
    last = true,
    number = 0,
  } = groupsListData?.tradingEngineAdminGroups || {};

  const handleDeleteGroup = async (groupName: string) => {
    try {
      await deleteGroup({ variables: { groupName } });

      await refetch();
      confirmationModal.hide();
      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.GROUPS.NOTIFICATION.DELETE.SUCCESS'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('TRADING_ENGINE.GROUPS.NOTIFICATION.DELETE.FAILED'),
      });
    }
  };

  const handleDeleteGroupModal = (groupName: string) => {
    confirmationModal.show({
      onSubmit: () => handleDeleteGroup(groupName),
      modalTitle: I18n.t('TRADING_ENGINE.GROUPS.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.GROUPS.CONFIRMATION.DELETE.DESCRIPTION', { groupName }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  const handleEditGroupClick = (groupName: string) => {
    history.push(`/trading-engine-admin/groups/edit-group/${groupName}`);
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
          render={({ groupName }: GroupList) => (
            <div className="GroupsGrid__cell-primary">
              {groupName}
            </div>
          )}
        />
        <Column
          width={300}
          header={I18n.t('TRADING_ENGINE.GROUPS.GRID.DESCRIPTION')}
          render={({ description }: GroupList) => (
            <div className="GroupsGrid__cell-primary">
              {description}
            </div>
          )}
        />
        <Column
          width={100}
          header={I18n.t('TRADING_ENGINE.GROUPS.GRID.MC_SO')}
          render={({ marginCallLevel, stopoutLevel }: GroupList) => (
            <div className="GroupsGrid__cell-primary">
              {`${marginCallLevel} / ${stopoutLevel} %`}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.GROUPS.GRID.SECURITIES')}
          render={({ groupSecurities }: GroupList) => {
            const securities = (groupSecurities || [])
              .map(({ security }: GroupSecurities) => security.name)
              .join(', ');

            return (
              <div>{securities}</div>
            );
          }}
        />
        <Column
          width={120}
          header={I18n.t('TRADING_ENGINE.GROUPS.GRID.ACTIONS')}
          render={({ groupName }: GroupList) => (
            <>
              <EditButton
                onClick={() => handleEditGroupClick(groupName)}
                className="GroupsGrid__edit-button"
              />
              <Button
                transparent
                onClick={() => handleDeleteGroupModal(groupName)}
              >
                <i className="fa fa-trash btn-transparent color-danger" />
              </Button>
            </>
          )}
        />
      </Table>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
  withRequests({
    deleteGroup: DeleteGroupMutation,
  }),
  withNotifications,
)(GroupsGrid);
