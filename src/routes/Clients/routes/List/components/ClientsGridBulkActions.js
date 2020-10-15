import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { omit } from 'lodash';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { deskTypes } from 'constants/hierarchyTypes';
import { departments } from 'constants/brands';
import { withStorage } from 'providers/StorageProvider';
import PermissionContent from 'components/PermissionContent';
import RepresentativeUpdateModal from 'components/RepresentativeUpdateModal';
import MoveModal from './Modals';

class ClientsGridBulkActions extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    allRowsSelected: PropTypes.bool.isRequired,
    resetClientsGridInitialState: PropTypes.func.isRequired,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    selectedRowsLength: PropTypes.number.isRequired,
    auth: PropTypes.auth.isRequired,
    modals: PropTypes.shape({
      representativeUpdateModal: PropTypes.modalType,
      confirmationModal: PropTypes.modalType,
    }).isRequired,
    profiles: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      refetch: PropTypes.func.isRequired,
      profiles: PropTypes.pageable(PropTypes.shape({
        last: PropTypes.bool,
        page: PropTypes.number,
        content: PropTypes.profileView,
        totalElements: PropTypes.number,
      })),
    }).isRequired,
  };

  handleTriggerRepModal = type => () => {
    const {
      touchedRowsIds,
      allRowsSelected,
      selectedRowsLength,
      location: { state },
      modals: { representativeUpdateModal },
      profiles: {
        profiles: {
          content,
        },
      },
    } = this.props;

    representativeUpdateModal.show({
      type,
      uuids: touchedRowsIds.map(index => content[index].uuid),
      configs: {
        allRowsSelected,
        selectedRowsLength,
        multiAssign: true,
        ...(state && { searchParams: omit(state.filters, ['page.size']) }),
      },
      onSuccess: this.onSubmitSuccess,
      header: (
        <Fragment>
          <div>{I18n.t(`CLIENTS.MODALS.${type}_MODAL.HEADER`)}</div>
          <div className="font-size-11 color-yellow">
            {selectedRowsLength} {I18n.t('COMMON.CLIENTS_SELECTED')}
          </div>
        </Fragment>
      ),
    });
  };

  handleTriggerMoveModal = () => {
    const {
      touchedRowsIds,
      allRowsSelected,
      selectedRowsLength,
      location: { state },
      modals: { moveModal },
      profiles: {
        profiles: {
          content,
          totalElements,
        },
      },
    } = this.props;

    moveModal.show({
      content,
      configs: {
        totalElements,
        touchedRowsIds,
        allRowsSelected,
        selectedRowsLength,
        ...(state && { searchParams: omit(state.filters, ['page.size']) }),
      },
      onSuccess: this.onSubmitSuccess,
    });
  };

  onSubmitSuccess = async () => {
    const {
      resetClientsGridInitialState,
      profiles: { refetch },
    } = this.props;

    resetClientsGridInitialState(() => refetch());
  };

  renderBulkAssignButtons = () => {
    const { auth: { department, role } } = this.props;

    return (
      <PermissionContent permissions={permissions.USER_PROFILE.CHANGE_ACQUISITION}>
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
        <If condition={(['ADMINISTRATION', 'HEAD_OF_DEPARTMENT'].includes(role)
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
        {this.renderBulkAssignButtons()}
      </div>
    );
  }
}

export default compose(
  withRouter,
  withStorage(['auth']),
  withModals({
    representativeUpdateModal: RepresentativeUpdateModal,
    moveModal: MoveModal,
  }),
)(ClientsGridBulkActions);
