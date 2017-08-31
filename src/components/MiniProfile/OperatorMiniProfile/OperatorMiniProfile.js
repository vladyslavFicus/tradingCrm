import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import Uuid from '../../Uuid';
import renderLabel from '../../../utils/renderLabel';
import { departmentsLabels, rolesLabels } from '../../../constants/operators';
import './OperatorMiniProfile.scss';

const OperatorMiniProfile = ({ operatorProfile }) => (
  <div className={`mini-profile operator-mini-profile_${operatorProfile.operatorStatus}`}>
    <div className="mini-profile-header">
      <label className="mini-profile-label">{operatorProfile.operatorStatus}</label>
      <div className="mini-profile-type">{I18n.t('MINI_PROFILE.OPERATOR')}</div>
      <div className="mini-profile-title">
        <span className="font-weight-700">{operatorProfile.firstName}{' '}{operatorProfile.lastName}</span>
      </div>
      <div className="mini-profile-ids">
        <Uuid uuid={operatorProfile.uuid} />
        {
          operatorProfile.country &&
          <span>{' - '}{operatorProfile.country}</span>
        }
      </div>
      {
        !!operatorProfile.authorities.length &&
        <div className="operator-mini-profile-departments">
          {
            operatorProfile.authorities.map(authority =>
              <div className="operator-mini-profile-department" key={authority.id}>
                <span className="font-weight-700">{ renderLabel(authority.department, departmentsLabels) }</span>
                {' - '}
                <span>{ renderLabel(authority.role, rolesLabels) }</span>
              </div>
            )
          }
        </div>
      }
      {
        operatorProfile.operatorStatus === 'CLOSED' &&
        <div className="mini-profile-status-reason">
          <div className="info-block">
            <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.STATUS_REASON')}</div>
            <div className="info-block_status-reason_body">ТУТ ДОЛЖЕН ВЫВОДИТСЯ РИЗОН</div>
          </div>
        </div>
      }
      <div className="mini-profile-content">
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.LAST_LOGIN')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              1 month 10 days ago
            </div>
            <div className="info-block-description">
              on 14.04.2017 14:57
            </div>
            <div className="info-block-description">
              for 1h 37m
            </div>
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.REGISTERED')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              {moment.utc(operatorProfile.registrationDate).local().fromNow()}
            </div>
            <div className="info-block-description">
              on 13.09.2017 14:57
            </div>
            <div className="info-block-description">
              by OP-2242525ryeebf
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

OperatorMiniProfile.propTypes = {
  operatorProfile: PropTypes.userProfile.isRequired,
};

export default OperatorMiniProfile;
