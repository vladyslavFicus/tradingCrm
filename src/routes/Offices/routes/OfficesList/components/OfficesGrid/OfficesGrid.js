import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { get } from 'lodash';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { withPermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { EditButton, Button } from 'components/UI';
import PermissionContent from 'components/PermissionContent';
import { Link } from 'components/Link';
import { Table, Column } from 'components/Table';
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
    permission: PropTypes.permission.isRequired,
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
        <Button
          transparent
          onClick={() => this.handleDeleteClick(data)}
        >
          <i className="fa fa-trash btn-transparent color-danger" />
        </Button>
      </PermissionContent>
    </>
  );

  render() {
    const {
      officesData,
      permission,
    } = this.props;

    const officesList = get(officesData, 'data.branch') || [];
    const isLoading = officesData.loading;

    const updateBranchPermissions = permission.allows(permissions.HIERARCHY.UPDATE_BRANCH);
    const updateDeleteBranchPermissions = permission.allows(permissions.HIERARCHY.DELETE_BRANCH);

    return (
      <div className="OfficesGrid">
        <Table
          stickyFromTop={137}
          items={officesList}
          loading={isLoading}
        >
          <Column
            header={I18n.t('OFFICES.GRID_HEADER.OFFICE')}
            render={this.renderOfficeColumn}
          />
          <Column
            header={I18n.t('OFFICES.GRID_HEADER.COUNTRY')}
            render={this.renderCountryColumn}
          />
          <If condition={updateBranchPermissions || updateDeleteBranchPermissions}>
            <Column
              header={I18n.t('OFFICES.GRID_HEADER.ACTIONS')}
              render={this.renderActions}
            />
          </If>
        </Table>
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
