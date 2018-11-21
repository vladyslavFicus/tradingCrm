import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { departments } from '../../../../../../../constants/brands';
import transformAcquisitionData from './constants';
import './AcquisitionStatus.scss';

const AcquisitionStatus = (
  { acquisitionData, loading, auth: { isAdministration } },
  { triggerRepresentativeUpdateModal }
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
                onClick={isAdministration ? triggerRepresentativeUpdateModal(modalType) : null}
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
  auth: PropTypes.shape({
    isAdministration: PropTypes.bool.isRequired,
  }).isRequired,
};

AcquisitionStatus.contextTypes = {
  triggerRepresentativeUpdateModal: PropTypes.func.isRequired,
};

const mapStateToProps = ({
  auth: { department },
}) => ({
  auth: {
    isAdministration: department === departments.ADMINISTRATION,
  },
});

export default connect(mapStateToProps)(AcquisitionStatus);
