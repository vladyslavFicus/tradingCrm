import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { get } from 'lodash';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import { withStorage } from 'providers/StorageProvider';
import { withPermission } from 'providers/PermissionsProvider';
import RepresentativeUpdateModal from 'components/RepresentativeUpdateModal';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import transformAcquisitionData from './utils';
import './AcquisitionStatus.scss';

const changeAcquisitionStatus = new Permissions([permissions.USER_PROFILE.CHANGE_ACQUISITION_STATUS]);

class AcquisitionStatus extends PureComponent {
  static propTypes = {
    newProfile: PropTypes.object,
    acquisitionData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
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

  static defaultProps = {
    newProfile: null,
  };

  handleChangeAcquisitionStatusClick = (type) => {
    const {
      modals: { representativeUpdateModal },
      newProfile: { uuid, acquisition },
    } = this.props;

    const assignToOperator = get(acquisition, `${type.toLowerCase()}Representative`) || null;

    representativeUpdateModal.show({
      type,
      clients: [{ uuid }],
      currentInactiveOperator: assignToOperator,
      header: I18n.t('CLIENT_PROFILE.MODALS.REPRESENTATIVE_UPDATE.HEADER', { type: type.toLowerCase() }),
      isAvailableToMove: true,
      onSuccess: () => {},
    });
  };

  render() {
    const {
      loading,
      acquisitionData,
      auth: { department },
      permission: { permissions: currentPermissions },
    } = this.props;

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
                        ? () => this.handleChangeAcquisitionStatusClick(modalType)
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
