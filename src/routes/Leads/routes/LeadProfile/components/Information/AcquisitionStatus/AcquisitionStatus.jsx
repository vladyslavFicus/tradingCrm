import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import { salesStatuses, salesStatusesColor } from '../../../../../../../constants/salesStatuses';
import './AcquisitionStatus.scss';

const AcquisitionStatus = ({ data: { salesStatus, salesAgent }, loading }) => console.log('salesAgent', salesAgent) || (
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
              <Choose>
                <When condition={salesStatus}>
                  <div className={classNames('status', salesStatusesColor[salesStatus])}>
                    {I18n.t(salesStatuses[salesStatus])}
                  </div>
                </When>
                <Otherwise>
                  <span>&mdash;</span>
                </Otherwise>
              </Choose>
            </div>
            <div className="operator-col">
              <div>Sales DK</div>
              <div className="name">
                <Choose>
                  <When condition={salesAgent}>
                    {salesAgent.fullName}
                  </When>
                  <Otherwise>
                    <span>&mdash;</span>
                  </Otherwise>
                </Choose>
              </div>
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
    salesAgent: PropTypes.shape({
      fullName: PropTypes.string,
      uuid: PropTypes.string,
    }),
  }),
  loading: PropTypes.bool.isRequired,
};

AcquisitionStatus.defaultProps = {
  data: {},
};

export default AcquisitionStatus;
