import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { Modal } from 'types';
import { HierarchyBranch } from '__generated__/types';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import { EditButton, TrashButton } from 'components/Buttons';
import UpdateTeamModal from 'modals/UpdateTeamModal';
import DeleteBranchModal from 'modals/DeleteBranchModal';
import './TeamsGrid.scss';

type Props = {
  loading: boolean,
  teamsList: Array<HierarchyBranch>,
  modals: {
    updateTeamModal: Modal,
    deleteBranchModal: Modal,
  },
  onRefetch: () => void,
};

const TeamsGrid = (props: Props) => {
  const {
    loading,
    teamsList,
    modals: {
      updateTeamModal,
      deleteBranchModal,
    },
    onRefetch,
  } = props;

  const permission = usePermission();

  const isAllowUpdateBranch = permission.allows(permissions.HIERARCHY.UPDATE_BRANCH);
  const isAllowDeleteBranch = permission.allows(permissions.HIERARCHY.DELETE_BRANCH);
  const isAllowActions = isAllowUpdateBranch || isAllowDeleteBranch;

  // ===== Handlers ===== //
  const handleEditClick = (data: HierarchyBranch) => {
    updateTeamModal.show({
      data,
      onSuccess: onRefetch,
    });
  };

  const handleDeleteClick = ({ uuid, name }: HierarchyBranch) => {
    deleteBranchModal.show({
      uuid,
      name,
      onSuccess: onRefetch,
    });
  };

  // ===== Renders ===== //
  const renderTeamCell = ({ name, uuid }: HierarchyBranch) => (
    <>
      <div className="TeamsGrid__cell-primary">
        <Link to={`/teams/${uuid}`}>{name}</Link>
      </div>

      <div className="TeamsGrid__cell-secondary">
        <Uuid uuid={uuid} uuidPrefix="TE" />
      </div>
    </>
  );

  const renderOfficeCell = ({ parentBranch }: HierarchyBranch) => {
    const office = parentBranch?.parentBranch;

    if (!office) {
      return <span>&mdash;</span>;
    }

    return (
      <>
        <div className="TeamsGrid__cell-primary">{office.name}</div>

        <div className="TeamsGrid__cell-secondary">
          <Uuid uuid={office.uuid} uuidPrefix="OF" />
        </div>
      </>
    );
  };

  const renderDeskCell = ({ parentBranch }: HierarchyBranch) => {
    if (!parentBranch) {
      return <span>&mdash;</span>;
    }

    return (
      <>
        <div className="TeamsGrid__cell-primary">{parentBranch.name}</div>

        <div className="TeamsGrid__cell-secondary">
          <Uuid uuid={parentBranch.uuid} uuidPrefix="DE" />
        </div>
      </>
    );
  };

  const renderActions = (data: HierarchyBranch) => (
    <>
      <If condition={isAllowUpdateBranch}>
        <EditButton
          onClick={() => handleEditClick(data)}
          className="TeamsGrid__edit-button"
        />
      </If>

      <If condition={isAllowDeleteBranch}>
        <TrashButton onClick={() => handleDeleteClick(data)} />
      </If>
    </>
  );

  return (
    <div className="TeamsGrid">
      <Table
        stickyFromTop={137}
        items={teamsList}
        loading={loading}
      >
        <Column
          header={I18n.t('TEAMS.GRID_HEADER.TEAM')}
          render={renderTeamCell}
        />

        <Column
          header={I18n.t('TEAMS.GRID_HEADER.OFFICE')}
          render={renderOfficeCell}
        />

        <Column
          header={I18n.t('TEAMS.GRID_HEADER.DESK')}
          render={renderDeskCell}
        />

        <If condition={isAllowActions}>
          <Column
            header={I18n.t('TEAMS.GRID_HEADER.ACTIONS')}
            render={renderActions}
          />
        </If>
      </Table>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    updateTeamModal: UpdateTeamModal,
    deleteBranchModal: DeleteBranchModal,
  }),
)(TeamsGrid);
