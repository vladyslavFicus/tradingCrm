import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { get, omit } from 'lodash';
import I18n from 'i18n-js';
import { getActiveBrandConfig } from 'config';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { deskTypes } from 'constants/hierarchyTypes';
import { departments, roles } from 'constants/brands';
import { fsaStatuses } from 'constants/fsaMigration';
import { withStorage } from 'providers/StorageProvider';
import { withModals, withNotifications } from 'components/HighOrder';
import PermissionContent from 'components/PermissionContent';
import RepresentativeUpdateModal from 'components/RepresentativeUpdateModal';
import MigrateButton from 'components/MigrateButton';
import MoveModal from './Modals';
import { getClientsData } from './utils';

class ClientsGridBulkActions extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    notify: PropTypes.func.isRequired,
    allRowsSelected: PropTypes.bool.isRequired,
    resetClientsGridInitialState: PropTypes.func.isRequired,
    selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    auth: PropTypes.auth.isRequired,
    modals: PropTypes.shape({
      representativeModal: PropTypes.modalType,
      confirmationModal: PropTypes.modalType,
    }).isRequired,
    profiles: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
      profiles: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.shape({
          last: PropTypes.bool,
          page: PropTypes.number,
          content: PropTypes.profileView,
          totalElements: PropTypes.number,
        })),
      }),
    }).isRequired,
  };

  handleTriggerRepModal = type => () => {
    const {
      selectedRows,
      touchedRowsIds,
      allRowsSelected,
      location: { query },
      modals: { representativeModal },
      profiles: {
        profiles: {
          data: { content, totalElements },
        },
      },
    } = this.props;

    const clients = getClientsData(
      { selectedRows, touchedRowsIds, allRowsSelected },
      totalElements,
      { type },
      content,
    );

    representativeModal.show({
      type,
      clients,
      configs: {
        allRowsSelected,
        totalElements: selectedRows.length,
        multiAssign: true,
        ...(query && { searchParams: omit(query.filters, ['page.size']) }),
      },
      onSuccess: this.onSuccessListUpdate,
      header: (
        <Fragment>
          <div>{I18n.t(`CLIENTS.MODALS.${type}_MODAL.HEADER`)}</div>
          <div className="font-size-11 color-yellow">
            {selectedRows.length} {I18n.t('COMMON.CLIENTS_SELECTED')}
          </div>
        </Fragment>
      ),
    });
  };

  handleTriggerMoveModal = () => {
    const {
      selectedRows,
      touchedRowsIds,
      allRowsSelected,
      location: { query },
      modals: { moveModal },
      profiles: {
        profiles: {
          data: { content, totalElements },
        },
      },
    } = this.props;

    moveModal.show({
      content,
      configs: {
        totalElements,
        selectedRows,
        touchedRowsIds,
        allRowsSelected,
        ...(query && { searchParams: omit(query.filters, ['page.size']) }),
      },
      onSuccess: this.onSuccessListUpdate,
    });
  };

  onSuccessListUpdate = async () => {
    const {
      resetClientsGridInitialState,
      profiles: { refetch },
    } = this.props;

    resetClientsGridInitialState(() => refetch());
  };

  renderMigrateToFsaButton = () => {
    const {
      selectedRows,
      touchedRowsIds,
      allRowsSelected,
      location: { query },
      profiles: {
        profiles: {
          data: { content, totalElements },
        },
      },
    } = this.props;

    const { fsaMigrationStatus } = get(query, 'filters') || {};

    const showMigrateButton = getActiveBrandConfig().fsaRegulation
      && fsaMigrationStatus === fsaStatuses.MIGRATION_ACCEPTED;

    const clients = getClientsData(
      { selectedRows, touchedRowsIds, allRowsSelected },
      totalElements,
      {},
      content,
    ).map(client => ({ uuid: client.uuid }));

    return (
      <If condition={showMigrateButton}>
        <PermissionContent permissions={permissions.USER_PROFILE.MIGRATE_TO_FSA}>
          <MigrateButton
            className="btn btn-default-outline"
            variables={{
              clients,
              totalElements,
              allRowsSelected,
            }}
          />
        </PermissionContent>
      </If>
    );
  };

  renderBulkAssignButtons = () => {
    const { auth: { department, role } } = this.props;

    return (
      <PermissionContent permissions={permissions.USER_PROFILE.CHANGE_ACQUISITION_STATUS}>
        <If condition={department !== departments.RETENTION}>
          <button
            type="button"
            className="btn btn-default-outline"
            onClick={this.handleTriggerRepModal(deskTypes.SALES)}
          >
            {I18n.t('COMMON.SALES')}
          </button>
        </If>
        <If condition={department !== departments.SALES}>
          <button
            type="button"
            className="btn btn-default-outline"
            onClick={this.handleTriggerRepModal(deskTypes.RETENTION)}
          >
            {I18n.t('COMMON.RETENTION')}
          </button>
        </If>
        <If condition={(role === roles.ROLE4
          && [departments.ADMINISTRATION, departments.SALES, departments.RETENTION].includes(department))
          || department === departments.CS}
        >
          <button
            type="button"
            className="btn btn-default-outline"
            onClick={this.handleTriggerMoveModal}
          >
            {I18n.t('COMMON.MOVE')}
          </button>
        </If>
      </PermissionContent>
    );
  };

  render() {
    return (
      <div className="grid-bulk-menu ml-auto">
        <span>{I18n.t('CLIENTS.BULK_ACTIONS')}</span>

        {this.renderMigrateToFsaButton()}
        {this.renderBulkAssignButtons()}
      </div>
    );
  }
}

export default compose(
  withRouter,
  withStorage(['auth']),
  withNotifications,
  withModals({
    representativeModal: RepresentativeUpdateModal,
    moveModal: MoveModal,
  }),
)(ClientsGridBulkActions);
