import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import Grid, { GridColumn } from 'components/Grid';
import PermissionContent from 'components/PermissionContent';
import { EditButton, RemoveButton } from 'components/UI';
import DeleteBranchModal from 'modals/DeleteBranchModal';
import UpdateDeskModal from '../UpdateDeskModal';
import './DesksGrid.scss';

class DesksGrid extends PureComponent {
  static propTypes = {
    modals: PropTypes.shape({
      deleteBranchModal: PropTypes.modalType.isRequired,
      updateDeskModal: PropTypes.modalType.isRequired,
    }).isRequired,
    desksData: PropTypes.branchHierarchyResponse.isRequired,
  };

  handleEditClick = (data) => {
    const {
      desksData,
      modals: { updateDeskModal },
    } = this.props;

    updateDeskModal.show({
      data,
      onSuccess: desksData.refetch,
    });
  };

  handleDeleteClick = ({ uuid, name }) => {
    const {
      desksData,
      modals: { deleteBranchModal },
    } = this.props;

    deleteBranchModal.show({
      uuid,
      name,
      onSuccess: desksData.refetch,
    });
  };

  renderDeskCell = ({ name, uuid }) => (
    <Fragment>
      <div className="DesksGrid__cell-primary">
        <Link to={`/desks/${uuid}`}>{name}</Link>
      </div>
      <div className="DesksGrid__cell-secondary">
        <Uuid uuid={uuid} uuidPrefix="DE" />
      </div>
    </Fragment>
  );

  renderOfficeCell = ({ parentBranch }) => (
    <Choose>
      <When condition={parentBranch}>
        <div className="DesksGrid__cell-primary">{parentBranch.name}</div>
        <div className="DesksGrid__cell-secondary">
          <Uuid uuid={parentBranch.uuid} uuidPrefix="OF" />
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderDeskTypesCell = ({ deskType }) => (
    <div className="DesksGrid__cell-primary">
      {I18n.t(`DESKS.MODAL.LABELS.DESK_TYPE_OPTIONS.${deskType}`)}
    </div>
  );

  renderActions = data => (
    <>
      <PermissionContent permissions={permissions.HIERARCHY.UPDATE_BRANCH}>
        <EditButton
          onClick={() => this.handleEditClick(data)}
          className="DesksGrid__edit-button"
        />
      </PermissionContent>
      <PermissionContent permissions={permissions.HIERARCHY.DELETE_BRANCH}>
        <RemoveButton onClick={() => this.handleDeleteClick(data)} />
      </PermissionContent>
    </>
  );

  render() {
    const { desksData } = this.props;

    const isLoading = desksData.loading;
    const desks = get(desksData, 'data.branch') || [];

    return (
      <div className="DesksGrid">
        <Grid
          data={desks}
          isLoading={isLoading}
          headerStickyFromTop={138}
        >
          <GridColumn
            header={I18n.t('DESKS.GRID_HEADER.DESK')}
            render={this.renderDeskCell}
          />
          <GridColumn
            header={I18n.t('DESKS.GRID_HEADER.OFFICE')}
            render={this.renderOfficeCell}
          />
          <GridColumn
            header={I18n.t('DESKS.GRID_HEADER.DESK_TYPE')}
            render={this.renderDeskTypesCell}
          />
          <GridColumn
            header={I18n.t('DESKS.GRID_HEADER.ACTIONS')}
            render={this.renderActions}
          />
        </Grid>
      </div>
    );
  }
}

export default withModals({
  updateDeskModal: UpdateDeskModal,
  deleteBranchModal: DeleteBranchModal,
})(DesksGrid);
