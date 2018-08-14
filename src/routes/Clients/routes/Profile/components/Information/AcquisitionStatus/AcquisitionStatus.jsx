import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { acquisitionStatuses } from './constants';
import './AcquisitionStatus.scss';

const AcquisitionStatus = ({ acquisitionData }) => (
  <div className="account-details__personal-info">
    <span className="account-details__label">
      {I18n.t('CLIENT_PROFILE.CLIENT.ACQUISITION.TITLE')}
    </span>
    <div className="card">
      <div className="card-body acquisition-status">
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
              <div className="name">{acquisitionData[`${item}RepName`]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

AcquisitionStatus.propTypes = {
  // TODO: When api ready, redo to ptsh
  acquisitionData: PropTypes.object.isRequired,
};

export default AcquisitionStatus;
