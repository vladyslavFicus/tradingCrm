import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import Grid, { GridColumn } from 'components/Grid';
import { EditButton, RemoveButton } from 'components/UI';
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
        <RemoveButton onClick={() => this.handleDeleteClick(data)} />
      </PermissionContent>
    </>
  );

  render() {
    const { teamsData } = this.props;

    const isLoading = teamsData.loading;
    const teams = get(teamsData, 'data.branch') || [];

    return (
      <div className="TeamsGrid">
        <Grid
          data={teams}
          isLoading={isLoading}
          headerStickyFromTop={138}
          withNoResults={!isLoading && teams.length === 0}
        >
          <GridColumn
            header={I18n.t('TEAMS.GRID_HEADER.TEAM')}
            render={this.renderTeamCell}
          />
          <GridColumn
            header={I18n.t('TEAMS.GRID_HEADER.OFFICE')}
            render={this.renderOfficeCell}
          />
          <GridColumn
            header={I18n.t('TEAMS.GRID_HEADER.DESK')}
            render={this.renderDeskCell}
          />
          <GridColumn
            header={I18n.t('TEAMS.GRID_HEADER.ACTIONS')}
            render={this.renderActions}
          />
        </Grid>
      </div>
    );
  }
}

export default withModals({
  updateTeamModal: UpdateTeamModal,
  deleteBranchModal: DeleteBranchModal,
})(TeamsGrid);
