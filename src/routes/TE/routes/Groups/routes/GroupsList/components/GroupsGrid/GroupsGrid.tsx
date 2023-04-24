import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { cloneDeep, set } from 'lodash';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { parseErrors } from 'apollo';
import { usePermission } from 'providers/PermissionsProvider';
import { withNotifications } from 'hoc';
import { State, Sort } from 'types';
import { useModal } from 'providers/ModalProvider';
import permissions from 'config/permissions';
import { LevelType, Notify } from 'types/notify';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import { Table, Column } from 'components/Table';
import { Button, TrashButton } from 'components/Buttons';
import PermissionContent from 'components/PermissionContent';
import { GroupsQueryQueryResult, GroupsQuery, GroupsQueryVariables } from '../../graphql/__generated__/GroupsQuery';
import { useArchiveMutation } from './graphql/__generated__/ArchiveMutation';
import { useDeleteGroupMutation } from './graphql/__generated__/DeleteGroupMutation';
import './GroupsGrid.scss';

type GroupType = ExtractApolloTypeFromPageable<GroupsQuery['tradingEngine']['groups']>;

type Props = {
  groupsListQuery: GroupsQueryQueryResult,
  notify: Notify,
}

const GroupsGrid = ({
  groupsListQuery,
  notify,
}: Props) => {
  const { state } = useLocation<State<GroupsQueryVariables>>();
  const history = useHistory();
  const [deleteGroup] = useDeleteGroupMutation();
  const [archiveGroup] = useArchiveMutation();
  const permission = usePermission();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  // New confirmation instance is needed to show an error when archiving a group
  // since the submit handle works after it is shown again and closes it
  const confirmErrorModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);

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
      confirmActionModal.hide();
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

  const handleArchiveAccount = async (groupName: string, enabled: boolean, force = false) => {
    try {
      await archiveGroup({ variables: { groupName, enabled, force } });
      refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t(`TRADING_ENGINE.GROUP.NOTIFICATION.${enabled ? 'UNARCHIVED' : 'ARCHIVED'}`),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.group.has.active.accounts') {
        const {
          ordersCount,
          accountsCount,
        } = error.errorParameters;

        const actionText = Number(ordersCount) > 0
          ? I18n.t('TRADING_ENGINE.GROUP.GROUPS_HAS_ACTIVE_ACCOUNTS_AND_OPEN_ORDERS', { accountsCount, ordersCount })
          : I18n.t('TRADING_ENGINE.GROUP.GROUPS_HAS_ACTIVE_ACCOUNTS', { accountsCount });

        confirmErrorModal.show({
          actionText,
          modalTitle: I18n.t(`TRADING_ENGINE.GROUP.NOTIFICATION.${enabled ? 'UNARCHIVE' : 'ARCHIVE'}`, { groupName }),
          submitButtonLabel: I18n.t('COMMON.YES'),
          onSubmit: () => handleArchiveAccount(groupName, enabled, true),
        });
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.ERROR'),
          message: I18n.t('TRADING_ENGINE.GROUP.NOTIFICATION.ARCHIVE_GROUP_ERROR'),
        });
      }
    }
  };

  const handleArchiveClick = (groupName: string, enabled: boolean) => {
    confirmActionModal.show({
      onSubmit: () => handleArchiveAccount(groupName, enabled),
      modalTitle: I18n.t(`TRADING_ENGINE.GROUP.NOTIFICATION.${enabled ? 'UNARCHIVE' : 'ARCHIVE'}`, { groupName }),
      actionText: I18n.t(
        `TRADING_ENGINE.GROUP.NOTIFICATION.${enabled ? 'UNARCHIVE_TEXT' : 'ARCHIVE_TEXT'}`,
      ),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  const handleDeleteGroupModal = (groupName: string) => {
    confirmActionModal.show({
      onSubmit: () => handleDeleteGroup(groupName),
      modalTitle: I18n.t('TRADING_ENGINE.GROUPS.CONFIRMATION.DELETE.TITLE'),
      actionText: I18n.t('TRADING_ENGINE.GROUPS.CONFIRMATION.DELETE.DESCRIPTION', { groupName }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
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
            <>
              <Choose>
                <When condition={permission.allows(permissions.WE_TRADING.EDIT_GROUP)}>
                  <Link to={`/trading-engine/groups/${groupName}`} target="_blank">
                    <div className="GroupsGrid__cell-primary">
                      {groupName}
                    </div>
                  </Link>
                </When>
                <Otherwise>
                  <div className="GroupsGrid__cell-primary">
                    {groupName}
                  </div>
                </Otherwise>
              </Choose>
            </>
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
         permission.allows(permissions.WE_TRADING.DELETE_GROUP)}
        >
          <Column
            header={I18n.t('TRADING_ENGINE.GROUPS.GRID.ACTIONS')}
            render={({ groupName, enabled }: GroupType) => (
              <div className="GroupsGrid__cell-actions">
                <PermissionContent permissions={permissions.WE_TRADING.DELETE_GROUP}>
                  <TrashButton
                    className="GroupsGrid__trash"
                    onClick={() => handleDeleteGroupModal(groupName)}
                  />
                </PermissionContent>
                <PermissionContent permissions={permissions.WE_TRADING.UPDATE_GROUP_ENABLE}>
                  <Button
                    small
                    danger={enabled}
                    tertiary={!enabled}
                    className="GroupsGrid__button"
                    onClick={() => handleArchiveClick(groupName, !enabled)}
                  >
                    {I18n.t(`TRADING_ENGINE.GROUPS.${enabled ? 'ARCHIVE' : 'UNARCHIVE'}`)}
                  </Button>
                </PermissionContent>
              </div>
            )}
          />
        </If>
      </Table>
    </div>
  );
};

export default compose(
  React.memo,
  withNotifications,
)(GroupsGrid);
