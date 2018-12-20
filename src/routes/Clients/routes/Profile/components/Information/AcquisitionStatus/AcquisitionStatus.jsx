import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import Permissions from 'utils/permissions';
import permissions from 'config/permissions';
import transformAcquisitionData from './constants';
import './AcquisitionStatus.scss';

const changeAcquisitionStatus = new Permissions([permissions.USER_PROFILE.CHANGE_ACQUISITION_STATUS]);

const AcquisitionStatus = (
  { acquisitionData, loading },
  { triggerRepresentativeUpdateModal, permissions: currentPermissions }
) => (
  <div className="account-details__personal-info">
    <span className="account-details__label">
      {I18n.t('CLIENT_PROFILE.CLIENT.ACQUISITION.TITLE')}
    </span>
    <div className="card">
      <div className="card-body acquisition-status">
        <If condition={!loading}>
          {transformAcquisitionData(acquisitionData)
            .map(({ label, statusLabel, statusColor, borderColor, repName, modalType }) => (
              <div
                key={label}
                className={`acquisition-item border-${borderColor || 'color-neutral'}`}
                onClick={
                  changeAcquisitionStatus.check(currentPermissions)
                    ? triggerRepresentativeUpdateModal(modalType)
                    : null
                }
              >
                <div className="status-col">
                  <div>{I18n.t(label)}</div>
                  <div className={`status ${statusColor}`}>
                    {statusLabel}
                  </div>
                </div>
                <div className="operator-col">
                  <div className="name">{repName}</div>
                </div>
              </div>
            ))
          }
        </If>
      </div>
    </div>
  </div>
);

AcquisitionStatus.propTypes = {
  acquisitionData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

AcquisitionStatus.contextTypes = {
  triggerRepresentativeUpdateModal: PropTypes.func.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default AcquisitionStatus;
