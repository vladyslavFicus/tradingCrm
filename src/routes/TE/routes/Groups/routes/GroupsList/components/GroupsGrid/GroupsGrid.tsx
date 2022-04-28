import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { cloneDeep, set } from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import { parseErrors } from 'apollo';
import { usePermission } from 'providers/PermissionsProvider';
import { withNotifications, withModals } from 'hoc';
import { State, Sort, Modal } from 'types';
import permissions from 'config/permissions';
import { LevelType, Notify } from 'types/notify';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { EditButton, Button } from 'components/UI';
import PermissionContent from 'components/PermissionContent';
import { GroupsQueryQueryResult, GroupsQuery, GroupsQueryVariables } from '../../graphql/__generated__/GroupsQuery';
import { useDeleteGroupMutation } from './graphql/__generated__/DeleteGroupMutation';
import './GroupsGrid.scss';

type GroupType = ExtractApolloTypeFromPageable<GroupsQuery['tradingEngine']['groups']>;

interface ConfirmationModalProps {
  onSubmit: (groupName: string) => void,
  modalTitle: string,
  actionText: string,
  submitButtonLabel: string,
}

interface Props {
  groupsListQuery: GroupsQueryQueryResult,
  notify: Notify,
  modals: {
    confirmationModal: Modal<ConfirmationModalProps>,
  },
}

const GroupsGrid = ({
  groupsListQuery,
  modals: {
    confirmationModal,
  },
  notify,
}: Props) => {
  const { state } = useLocation<State<GroupsQueryVariables>>();
  const history = useHistory();
  const [deleteGroup] = useDeleteGroupMutation();
  const permission = usePermission();

  const { loading, data: groupsListData, refetch } = groupsListQuery || {};
  const {
    content = [],
    totalElements,
    last = true,
  } = groupsListData?.tradingEngine.groups || {};

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
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: error.error === 'error.group.has.accounts'
          ? I18n.t('TRADING_ENGINE.GROUPS.NOTIFICATION.DELETE.HAS_ACCOUNTS', {
            accountsCount: error.errorParameters.assignedAccountsCount,
            groupName,
          })
          : I18n.t('TRADING_ENGINE.GROUPS.NOTIFICATION.DELETE.FAILED'),
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
    history.push(`/trading-engine/groups/${groupName}`);
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
    const { data, variables, fetchMore } = groupsListQuery;

    const page = data?.tradingEngine.groups.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables as GroupsQueryVariables), 'args.page.from', page + 1),
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
          render={({ groupName }: GroupType) => (
            <div className="GroupsGrid__cell-primary">
              {groupName}
            </div>
          )}
        />
        <Column
          width={300}
          header={I18n.t('TRADING_ENGINE.GROUPS.GRID.DESCRIPTION')}
          render={({ description }: GroupType) => (
            <div className="GroupsGrid__cell-primary">
              {description}
            </div>
          )}
        />
        <Column
          width={300}
          header={I18n.t('TRADING_ENGINE.GROUPS.GRID.CURRENCY')}
          render={({ currency }: GroupType) => (
            <div className="GroupsGrid__cell-primary">
              {currency}
            </div>
          )}
        />
        <Column
          width={100}
          header={I18n.t('TRADING_ENGINE.GROUPS.GRID.MC_SO')}
          render={({ marginCallLevel, stopoutLevel }: GroupType) => (
            <div className="GroupsGrid__cell-primary">
              {`${marginCallLevel} / ${stopoutLevel} %`}
            </div>
          )}
        />
        <Column
          header={I18n.t('TRADING_ENGINE.GROUPS.GRID.SECURITIES')}
          render={({ groupSecurities }: GroupType) => (
            <Choose>
              {/* "groupSecurities" can be null (not an array), that's why this condition here */}
              <When condition={!!groupSecurities && groupSecurities.length > 0}>
                <div>{groupSecurities?.map(({ security }) => security.name).join(', ')}</div>
              </When>
              <Otherwise>
                &mdash;
              </Otherwise>
            </Choose>
          )}
        />
        <If condition={
          permission.allows(permissions.WE_TRADING.EDIT_GROUP)
          || permission.allows(permissions.WE_TRADING.DELETE_GROUP)}
        >
          <Column
            width={120}
            header={I18n.t('TRADING_ENGINE.GROUPS.GRID.ACTIONS')}
            render={({ groupName }: GroupType) => (
              <>
                <PermissionContent permissions={permissions.WE_TRADING.EDIT_GROUP}>
                  <EditButton
                    onClick={() => handleEditGroupClick(groupName)}
                    className="GroupsGrid__edit-button"
                  />
                </PermissionContent>
                <PermissionContent permissions={permissions.WE_TRADING.DELETE_GROUP}>
                  <Button
                    transparent
                    onClick={() => handleDeleteGroupModal(groupName)}
                  >
                    <i className="fa fa-trash btn-transparent color-danger" />
                  </Button>
                </PermissionContent>
              </>
            )}
          />
        </If>
      </Table>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
  withNotifications,
)(GroupsGrid);
