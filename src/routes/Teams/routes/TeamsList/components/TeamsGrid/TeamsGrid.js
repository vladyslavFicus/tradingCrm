import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import compose from 'compose-function';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import { withPermission } from 'providers/PermissionsProvider';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import { Table, Column } from 'components/Table';
import { EditButton, TrashButton } from 'components/UI';
import PermissionContent from 'components/PermissionContent';
import DeleteBranchModal from 'modals/DeleteBranchModal';
import UpdateTeamModal from '../UpdateTeamModal';
import './TeamsGrid.scss';

class TeamsGrid extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      updateTeamModal: PropTypes.modalType.isRequired,
      deleteBranchModal: PropTypes.modalType.isRequired,
    }).isRequired,
    teamsData: PropTypes.branchHierarchyResponse.isRequired,
    permission: PropTypes.permission.isRequired,
  };

  handleEditClick = (data) => {
    const {
      teamsData,
      modals: { updateTeamModal },
    } = this.props;

    updateTeamModal.show({
      data,
      onSuccess: teamsData.refetch,
    });
  };

  handleDeleteClick = ({ uuid, name }) => {
    const {
      teamsData,
      modals: { deleteBranchModal },
    } = this.props;

    deleteBranchModal.show({
      uuid,
      name,
      onSuccess: teamsData.refetch,
    });
  };

  renderTeamCell = ({ name, uuid }) => (
    <Fragment>
      <div className="TeamsGrid__cell-primary">
        <Link to={`/teams/${uuid}`}>{name}</Link>
      </div>
      <div className="TeamsGrid__cell-secondary">
        <Uuid uuid={uuid} uuidPrefix="TE" />
      </div>
    </Fragment>
  );

  renderOfficeCell = ({ parentBranch }) => {
    const office = get(parentBranch, 'parentBranch') || null;

    return (
      <Choose>
        <When condition={office}>
          <div className="TeamsGrid__cell-primary">{office.name}</div>
          <div className="TeamsGrid__cell-secondary">
            <Uuid uuid={office.uuid} uuidPrefix="OF" />
          </div>
        </When>
        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>
    );
  };

  renderDeskCell = ({ parentBranch }) => (
    <Choose>
      <When condition={parentBranch}>
        <div className="TeamsGrid__cell-primary">{parentBranch.name}</div>
        <div className="TeamsGrid__cell-secondary">
          <Uuid uuid={parentBranch.uuid} uuidPrefix="DE" />
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderActions = data => (
    <>
      <PermissionContent permissions={permissions.HIERARCHY.UPDATE_BRANCH}>
        <EditButton
          onClick={() => this.handleEditClick(data)}
          className="TeamsGrid__edit-button"
        />
      </PermissionContent>
      <PermissionContent permissions={permissions.HIERARCHY.DELETE_BRANCH}>
        <TrashButton onClick={() => this.handleDeleteClick(data)} />
      </PermissionContent>
    </>
  );

  render() {
    const {
      teamsData,
      permission,
    } = this.props;

    const isLoading = teamsData.loading;
    const teams = get(teamsData, 'data.branch') || [];

    const updateBranchPermissions = permission.allows(permissions.HIERARCHY.UPDATE_BRANCH);
    const updateDeleteBranchPermissions = permission.allows(permissions.HIERARCHY.DELETE_BRANCH);

    return (
      <div className="TeamsGrid">
        <Table
          stickyFromTop={137}
          items={teams}
          loading={isLoading}
        >
          <Column
            header={I18n.t('TEAMS.GRID_HEADER.TEAM')}
            render={this.renderTeamCell}
          />
          <Column
            header={I18n.t('TEAMS.GRID_HEADER.OFFICE')}
            render={this.renderOfficeCell}
          />
          <Column
            header={I18n.t('TEAMS.GRID_HEADER.DESK')}
            render={this.renderDeskCell}
          />
          <If condition={updateBranchPermissions || updateDeleteBranchPermissions}>
            <Column
              header={I18n.t('TEAMS.GRID_HEADER.ACTIONS')}
              render={this.renderActions}
            />
          </If>
        </Table>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withModals({
    updateTeamModal: UpdateTeamModal,
    deleteBranchModal: DeleteBranchModal,
  }),
)(TeamsGrid);
