import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { acquisitionStatuses } from './constants';
import './AcquisitionStatus.scss';

const AcquisitionStatus = ({ acquisitionData, loading }) => (
  <div className="account-details__personal-info">
    <span className="account-details__label">
      {I18n.t('CLIENT_PROFILE.CLIENT.ACQUISITION.TITLE')}
    </span>
    <div className="card">
      <div className="card-body acquisition-status">
        <If condition={!loading}>
          {acquisitionStatuses.map(item => (
            <div key={item} className="acquisition-item">
              <div className="status-col">
                <div>{I18n.t(`CLIENT_PROFILE.CLIENT.ACQUISITION.${item}`)}</div>
                <div className={`status ${item === 'sales' ? item : ''}`}>
                  {acquisitionData[`${item}Status`]}
                </div>
              </div>
              <div className="operator-col">
                <div>DK</div>
                <div className="name">{acquisitionData[`${item}Rep`].fullName}</div>
              </div>
            </div>
          ))}
        </If>
      </div>
    </div>
  </div>
);

AcquisitionStatus.propTypes = {
  acquisitionData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default AcquisitionStatus;
