import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { deskTypes } from 'constants/hierarchyTypes';
import { departments } from 'constants/brands';
import { withStorage } from 'providers/StorageProvider';
import UpdateAcquisitionStatusModal from 'modals/UpdateAcquisitionStatusModal';
import { Button } from 'components/UI';
import PermissionContent from 'components/PermissionContent';
import RepresentativeUpdateModal from 'modals/RepresentativeUpdateModal';
import './ClientsBulkActions.scss';

class ClientsBulkActions extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    allRowsSelected: PropTypes.bool.isRequired,
    updateClientsListState: PropTypes.func.isRequired,
    selectedRowsLength: PropTypes.number.isRequired,
    auth: PropTypes.auth.isRequired,
    modals: PropTypes.shape({
      representativeUpdateModal: PropTypes.modalType,
      updateAcquisitionStatusModal: PropTypes.modalType,
    }).isRequired,
    clientsQuery: PropTypes.query({
      profiles: PropTypes.pageable(PropTypes.profileView),
    }).isRequired,
  };

  handleTriggerRepModal = type => () => {
    const {
      clientsQuery,
      touchedRowsIds,
      allRowsSelected,
      selectedRowsLength,
      location: { state },
      modals: { representativeUpdateModal },
    } = this.props;

    const clients = clientsQuery.data?.profiles?.content || [];

    representativeUpdateModal.show({
      type,
      uuids: touchedRowsIds.map(index => clients[index].uuid),
      configs: {
        allRowsSelected,
        selectedRowsLength,
        multiAssign: true,
        ...(state && {
          searchParams: state.filters,
          sorts: state.sorts,
        }),
      },
      onSuccess: this.onSubmitSuccess,
      header: (
        <Fragment>
          <div>{I18n.t(`CLIENTS.MODALS.${type}_MODAL.HEADER`)}</div>
          <small className="color-yellow">
            {selectedRowsLength} {I18n.t('COMMON.CLIENTS_SELECTED')}
          </small>
        </Fragment>
      ),
    });
  };

  handleTriggerUpdateAcquisitionStatusModal = () => {
    const {
      clientsQuery,
      touchedRowsIds,
      allRowsSelected,
      selectedRowsLength,
      location: { state },
      modals: { updateAcquisitionStatusModal },
    } = this.props;

    const clients = clientsQuery.data?.profiles?.content || [];
    const totalElements = clientsQuery.data?.profiles?.totalElements;

    updateAcquisitionStatusModal.show({
      content: clients,
      configs: {
        totalElements,
        touchedRowsIds,
        allRowsSelected,
        selectedRowsLength,
        ...(state && {
          searchParams: state.filters,
          sorts: state.sorts,
        }),
      },
      onSuccess: this.onSubmitSuccess,
    });
  };

  onSubmitSuccess = async () => {
    const {
      clientsQuery,
      updateClientsListState,
    } = this.props;

    clientsQuery.refetch();
    updateClientsListState();
  };

  render() {
    const { auth: { department } } = this.props;

    return (
      <div className="ClientsBulkActions">
        <div className="ClientsBulkActions__title">
          {I18n.t('CLIENTS.BULK_ACTIONS')}
        </div>

        <PermissionContent permissions={permissions.USER_PROFILE.CHANGE_ACQUISITION}>
          <If condition={department !== departments.RETENTION}>
            <Button
              commonOutline
              className="ClientsBulkActions__button"
              onClick={this.handleTriggerRepModal(deskTypes.SALES)}
            >
              {I18n.t('COMMON.SALES')}
            </Button>
          </If>
          <If condition={department !== departments.SALES}>
            <Button
              commonOutline
              className="ClientsBulkActions__button"
              onClick={this.handleTriggerRepModal(deskTypes.RETENTION)}
            >
              {I18n.t('COMMON.RETENTION')}
            </Button>
          </If>
        </PermissionContent>

        <PermissionContent permissions={permissions.USER_PROFILE.CHANGE_ACQUISITION_STATUS}>
          <Button
            commonOutline
            className="ClientsBulkActions__button"
            onClick={this.handleTriggerUpdateAcquisitionStatusModal}
          >
            {I18n.t('COMMON.MOVE')}
          </Button>
        </PermissionContent>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withStorage(['auth']),
  withModals({
    representativeUpdateModal: RepresentativeUpdateModal,
    updateAcquisitionStatusModal: UpdateAcquisitionStatusModal,
  }),
)(ClientsBulkActions);
