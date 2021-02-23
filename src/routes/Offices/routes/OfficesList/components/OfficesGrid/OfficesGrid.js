import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { compose } from 'react-apollo';
import { withModals } from 'hoc';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import Permissions from 'utils/permissions';
import { EditButton, RemoveButton } from 'components/UI';
import PermissionContent from 'components/PermissionContent';
import { Link } from 'components/Link';
import Grid, { GridColumn } from 'components/Grid';
import Uuid from 'components/Uuid';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import UpdateOfficeModal from 'modals/UpdateOfficeModal';
import DeleteBranchModal from 'modals/DeleteBranchModal';
import './OfficesGrid.scss';

class OfficesGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    modals: PropTypes.shape({
      updateOfficeModal: PropTypes.modalType.isRequired,
      deleteBranchModal: PropTypes.modalType.isRequired,
    }).isRequired,
    officesData: PropTypes.branchHierarchyResponse.isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  };

  handleEditClick = (data) => {
    const {
      officesData,
      modals: { updateOfficeModal },
    } = this.props;

    updateOfficeModal.show({
      data,
      onSuccess: officesData.refetch,
    });
  };

  handleDeleteClick = ({ uuid, name }) => {
    const {
      officesData,
      modals: { deleteBranchModal },
    } = this.props;

    deleteBranchModal.show({
      uuid,
      name,
      onSuccess: officesData.refetch,
    });
  };

  renderOfficeColumn = ({ name, uuid }) => (
    <Fragment>
      <Link
        className="OfficesGrid__cell-primary"
        to={`/offices/${uuid}`}
      >
        {name}
      </Link>
      <div className="OfficesGrid__cell-secondary">
        <Uuid uuid={uuid} uuidPrefix="OF" />
      </div>
    </Fragment>
  );

  renderCountryColumn = ({ country }) => (
    <Choose>
      <When condition={country}>
        <CountryLabelWithFlag
          code={country}
          height="14"
        />
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
          className="OfficesGrid__edit-button"
        />
      </PermissionContent>
      <PermissionContent permissions={permissions.HIERARCHY.DELETE_BRANCH}>
        <RemoveButton onClick={() => this.handleDeleteClick(data)} />
      </PermissionContent>
    </>
  );

  render() {
    const {
      officesData,
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const officesList = get(officesData, 'data.branch') || [];
    const isLoading = officesData.loading;

    const updateBranchPermissions = new Permissions(permissions.HIERARCHY.UPDATE_BRANCH).check(currentPermissions);
    const updateDeleteBranchPermissions = new Permissions(permissions.HIERARCHY.DELETE_BRANCH)
      .check(currentPermissions);

    return (
      <div className="OfficesGrid">
        <Grid
          data={officesList}
          isLoading={isLoading}
          headerStickyFromTop={138}
          withNoResults={!isLoading && officesList.length === 0}
        >
          <GridColumn
            name="office"
            header={I18n.t('OFFICES.GRID_HEADER.OFFICE')}
            render={this.renderOfficeColumn}
          />
          <GridColumn
            name="country"
            header={I18n.t('OFFICES.GRID_HEADER.COUNTRY')}
            render={this.renderCountryColumn}
          />
          <If condition={updateBranchPermissions || updateDeleteBranchPermissions}>
            <GridColumn
              header={I18n.t('OFFICES.GRID_HEADER.ACTIONS')}
              render={this.renderActions}
            />
          </If>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withPermission,
  withModals({
    updateOfficeModal: UpdateOfficeModal,
    deleteBranchModal: DeleteBranchModal,
  }),
)(OfficesGrid);
