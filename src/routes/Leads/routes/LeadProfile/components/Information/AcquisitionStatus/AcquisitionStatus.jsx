import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import { salesStatuses, salesStatusesColor } from '../../../../../../../constants/salesStatuses';
import './AcquisitionStatus.scss';

const AcquisitionStatus = ({ data: { salesStatus, salesAgent }, loading }) => (
  <div className="account-details__personal-info">
    <span className="account-details__label">
      {I18n.t('CLIENT_PROFILE.CLIENT.ACQUISITION.TITLE')}
    </span>
    <div className="card">
      <div className="card-body acquisition-status">
        <If condition={!loading}>
          <div className="acquisition-item">
            <div className="status-col">
              <div>{I18n.t('CLIENT_PROFILE.CLIENT.ACQUISITION.SALES')}</div>
              <div className={classNames('status', salesStatusesColor[salesStatus])}>
                {I18n.t(salesStatuses[salesStatus])}
              </div>
            </div>
            <div className="operator-col">
              <div>Sales DK</div>
              <div className="name">{salesAgent}</div>
            </div>
          </div>
        </If>
      </div>
    </div>
  </div>
);

AcquisitionStatus.propTypes = {
  data: PropTypes.shape({
    salesStatus: PropTypes.string,
    salesAgent: PropTypes.string,
  }),
  loading: PropTypes.bool.isRequired,
};

AcquisitionStatus.defaultProps = {
  data: {},
};

export default AcquisitionStatus;
