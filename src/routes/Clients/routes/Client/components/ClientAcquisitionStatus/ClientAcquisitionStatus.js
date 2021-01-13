import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { withModals } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import { withPermission } from 'providers/PermissionsProvider';
import PropTypes from 'constants/propTypes';
import { aquisitionStatuses } from 'constants/aquisitionStatuses';
import { salesStatusesColor, salesStatuses } from 'constants/salesStatuses';
import { retentionStatusesColor, retentionStatuses } from 'constants/retentionStatuses';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import RepresentativeUpdateModal from 'modals/RepresentativeUpdateModal';
import './ClientAcquisitionStatus.scss';

class ClientAcquisitionStatus extends PureComponent {
  static propTypes = {
    clientUuid: PropTypes.string.isRequired,
    clientAcquisition: PropTypes.acquisition.isRequired,
    auth: PropTypes.shape({
      department: PropTypes.string.isRequired,
    }).isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    modals: PropTypes.shape({
      representativeUpdateModal: PropTypes.modalType,
    }).isRequired,
  };

  get clientAcquisitionItems() {
    const {
      clientAcquisition,
      auth: { department },
    } = this.props;

    const {
      salesStatus,
      salesOperator,
      retentionStatus,
      retentionOperator,
      acquisitionStatus,
    } = clientAcquisition || {};

    const acquisitionItems = {
      SALES: {
        status: salesStatus,
        statusTitle: salesStatuses[salesStatus],
        statusColor: salesStatusesColor[salesStatus],
        operator: salesOperator,
        availableToUpdate: department !== 'SALES',
        isActive: acquisitionStatus === 'SALES',
      },
      RETENTION: {
        status: retentionStatus,
        statusTitle: retentionStatuses[retentionStatus],
        statusColor: retentionStatusesColor[retentionStatus],
        operator: retentionOperator,
        availableToUpdate: department !== 'RETENTION',
        isActive: acquisitionStatus === 'RETENTION',
      },
    };

    return acquisitionItems;
  }

  handleShowRepresentativeUpdateModal = (acquisitionType, availableToUpdate) => {
    const {
      clientUuid,
      modals: { representativeUpdateModal },
      permission: { permissions: currentPermissions },
    } = this.props;

    const changeAcquisition = new Permissions([permissions.USER_PROFILE.CHANGE_ACQUISITION]);
    const isAvailableToUpdate = changeAcquisition.check(currentPermissions) && availableToUpdate;

    if (isAvailableToUpdate) {
      representativeUpdateModal.show({
        uuid: clientUuid,
        type: acquisitionType,
        header: I18n.t('CLIENT_PROFILE.MODALS.REPRESENTATIVE_UPDATE.HEADER', {
          type: acquisitionType.toLowerCase(),
        }),
      });
    }
  }

  renderAcquisitionItem = (item) => {
    let team = null;
    let desk = null;

    const {
      label,
      status,
      operator,
      isActive,
      statusTitle,
      statusColor,
      acquisitionType,
      availableToUpdate,
    } = item;

    if (operator) {
      const branches = operator?.hierarchy?.parentBranches;

      team = branches?.find(branch => branch.branchType === 'TEAM');
      desk = team ? team.parentBranch : branches?.find(branch => branch.branchType === 'DESK');
    }

    return (
      <div
        key={acquisitionType}
        className={
          classNames('ClientAcquisitionStatus__item', {
            [`border-${statusColor}`]: isActive && statusColor,
          })
        }
        onClick={() => this.handleShowRepresentativeUpdateModal(acquisitionType, availableToUpdate)}
      >
        <div className="ClientAcquisitionStatus__left">
          <div className="ClientAcquisitionStatus__representative">
            {I18n.t(label)}
          </div>
          <Choose>
            <When condition={status}>
              <div className={classNames('ClientAcquisitionStatus__status', statusColor)}>
                {I18n.t(statusTitle)}
              </div>
            </When>
            <Otherwise>
              <div className="ClientAcquisitionStatus__status">
                {I18n.t('COMMON.NONE')}
              </div>
            </Otherwise>
          </Choose>
        </div>

        <div className="ClientAcquisitionStatus__right">
          <Choose>
            <When condition={operator}>
              <div className="ClientAcquisitionStatus__operator">{operator.fullName}</div>
            </When>
            <Otherwise>
              <div>&mdash;</div>
            </Otherwise>
          </Choose>

          <If condition={desk}>
            <div className="ClientAcquisitionStatus__branch">
              <b>{I18n.t('COMMON.DESK')}:</b> {desk.name}
            </div>
          </If>
          <If condition={team}>
            <div className="ClientAcquisitionStatus__branch">
              <b>{I18n.t('COMMON.TEAM')}:</b> {team.name}
            </div>
          </If>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="ClientAcquisitionStatus">
        <div className="ClientAcquisitionStatus__title">
          {I18n.t('CLIENT_PROFILE.CLIENT.ACQUISITION.TITLE')}
        </div>

        <div className="ClientAcquisitionStatus__content">
          {
            aquisitionStatuses.map(({ label, value }) => (
              this.renderAcquisitionItem({
                label,
                acquisitionType: value, // Sales / Retention
                ...this.clientAcquisitionItems[value],
              })
            ))
          }
        </div>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withStorage(['auth']),
  withModals({
    representativeUpdateModal: RepresentativeUpdateModal,
  }),
)(ClientAcquisitionStatus);
