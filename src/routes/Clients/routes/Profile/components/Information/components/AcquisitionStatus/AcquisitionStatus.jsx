import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { withStorage } from 'providers/StorageProvider';
import { withPermission } from 'providers/PermissionsProvider';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import transformAcquisitionData from './utils';
import './AcquisitionStatus.scss';

const changeAcquisitionStatus = new Permissions([permissions.USER_PROFILE.CHANGE_ACQUISITION_STATUS]);

class AcquisitionStatus extends PureComponent {
  static propTypes = {
    acquisitionData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    auth: PropTypes.shape({
      department: PropTypes.string.isRequired,
    }).isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }

  static contextTypes = {
    triggerRepresentativeUpdateModal: PropTypes.func.isRequired,
  }

  render() {
    const {
      loading,
      acquisitionData,
      auth: { department },
      permission: { permissions: currentPermissions },
    } = this.props;

    const { triggerRepresentativeUpdateModal } = this.context;

    return (
      <div className="account-details__personal-info">
        <span className="account-details__label">
          {I18n.t('CLIENT_PROFILE.CLIENT.ACQUISITION.TITLE')}
        </span>
        <div className="card">
          <div className="card-body acquisition-status">
            <If condition={!loading}>
              {transformAcquisitionData(acquisitionData, department)
                .map(({
                  label, statusLabel, statusColor, borderColor, repName, modalType, allowAction, desk, team,
                }) => (
                  <div
                    key={label}
                    className={`acquisition-item border-${borderColor || 'color-neutral'}`}
                    onClick={
                      changeAcquisitionStatus.check(currentPermissions) && allowAction
                        ? triggerRepresentativeUpdateModal(modalType)
                        : null
                    }
                  >
                    <div className="status-col">
                      <div>{I18n.t(label)}</div>
                      <div className={`status ${statusColor}`}>
                        {statusLabel ? I18n.t(statusLabel) : I18n.t('COMMON.NONE')}
                      </div>
                    </div>
                    <div className="operator-col">
                      <div>{repName}</div>
                      <div className="name">
                        <If condition={desk}>
                          <div>
                            <b>{I18n.t('DESKS.GRID_HEADER.DESK')}:</b> {desk.name}
                          </div>
                        </If>
                        <If condition={team}>
                          <div>
                            <b>{I18n.t('TEAMS.GRID_HEADER.TEAM')}:</b> {team.name}
                          </div>
                        </If>
                      </div>
                    </div>
                  </div>
                ))
              }
            </If>
          </div>
        </div>
      </div>
    );
  }
}

export default withStorage(['auth'])(withPermission(AcquisitionStatus));