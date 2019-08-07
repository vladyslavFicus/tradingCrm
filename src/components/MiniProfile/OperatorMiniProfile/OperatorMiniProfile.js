import React from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import Uuid from '../../Uuid';
import PropTypes from '../../../constants/propTypes';
import renderLabel from '../../../utils/renderLabel';
import { departmentsLabels, rolesLabels } from '../../../constants/operators';
import { operatorStatusNames } from '../constants';
import './OperatorMiniProfile.scss';

const OperatorMiniProfile = ({ data }) => (
  <div className={classNames('mini-profile operator-mini-profile', operatorStatusNames[data.operatorStatus])}>
    <div className="mini-profile-header">
      <label className="mini-profile-label">{data.operatorStatus}</label>
      <div className="mini-profile-type">{I18n.t('MINI_PROFILE.OPERATOR')}</div>
      <div className="mini-profile-title">
        <span className="font-weight-700">
          {`${data.firstName} ${data.lastName}`}
        </span>
      </div>
      <div className="mini-profile-ids">
        <Uuid uuid={data.uuid} />
        {data.country && <span>{` - ${data.country}`}</span>}
      </div>
      {
        !!data.authorities.length
        && (
          <div className="operator-mini-profile-departments">
            {
              data.authorities.map(authority => (
                <div className="operator-mini-profile-department" key={authority.id}>
                  <span className="font-weight-700">
                    {renderLabel(authority.department, departmentsLabels)}
                  </span>
                  {' - '}
                  <span>{ renderLabel(authority.role, rolesLabels) }</span>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
    <div className="mini-profile-content">
      <div className="info-block">
        <div className="info-block-label">{I18n.t('MINI_PROFILE.REGISTERED')}</div>
        <div className="info-block-content">
          <div className="info-block-heading">
            {moment.utc(data.registrationDate).local().fromNow()}
          </div>
          <div className="info-block-description">
            {I18n.t('COMMON.DATE_ON', {
              date: moment.utc(data.registrationDate).local().format('DD.MM.YYYY HH:mm'),
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
);

OperatorMiniProfile.propTypes = {
  data: PropTypes.operatorProfile.isRequired,
};

export default OperatorMiniProfile;
