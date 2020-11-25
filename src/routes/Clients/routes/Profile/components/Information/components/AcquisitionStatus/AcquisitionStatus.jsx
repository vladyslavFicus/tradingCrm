import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import { withStorage } from 'providers/StorageProvider';
import { withPermission } from 'providers/PermissionsProvider';
import RepresentativeUpdateModal from 'modals/RepresentativeUpdateModal';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import transformAcquisitionData from './utils';
import './AcquisitionStatus.scss';

const changeAcquisition = new Permissions([permissions.USER_PROFILE.CHANGE_ACQUISITION]);

class AcquisitionStatus extends PureComponent {
  static propTypes = {
    profile: PropTypes.profile.isRequired,
    profileLoading: PropTypes.bool.isRequired,
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

  handleChangeAcquisitionClick = (type) => {
    const {
      modals: { representativeUpdateModal },
      profile: { uuid },
    } = this.props;

    representativeUpdateModal.show({
      uuid,
      type,
      header: I18n.t('CLIENT_PROFILE.MODALS.REPRESENTATIVE_UPDATE.HEADER', { type: type.toLowerCase() }),
    });
  };

  render() {
    const {
      profile,
      profileLoading,
      auth: { department },
      permission: { permissions: currentPermissions },
    } = this.props;

    const acquisition = profile.acquisition || {};

    return (
      <div className="account-details__personal-info">
        <span className="account-details__label">
          {I18n.t('CLIENT_PROFILE.CLIENT.ACQUISITION.TITLE')}
        </span>
        <div className="card">
          <div className="card-body acquisition-status">
            <If condition={!profileLoading}>
              {transformAcquisitionData(acquisition, department)
                .map(({
                  label, statusLabel, statusColor, borderColor, repName, modalType, allowAction, desk, team,
                }) => (
                  <div
                    key={label}
                    className={`acquisition-item border-${borderColor || 'color-neutral'}`}
                    onClick={
                      changeAcquisition.check(currentPermissions) && allowAction
                        ? () => this.handleChangeAcquisitionClick(modalType)
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

export default compose(
  withPermission,
  withStorage(['auth']),
  withModals({
    representativeUpdateModal: RepresentativeUpdateModal,
  }),
)(AcquisitionStatus);
