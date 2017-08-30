import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import Uuid from '../../Uuid';
import renderLabel from '../../../utils/renderLabel';
import { departmentsLabels, rolesLabels } from '../../../constants/operators';
import './OperatorMiniProfile.scss';

const OperatorMiniProfile = ({ operatorData }) => (
  <div className={`mini-profile operator-mini-profile_${operatorData.operatorStatus}`}>
    {console.log(operatorData)}
    <div className="mini-profile-header">
      <label className="mini-profile-label">{operatorData.operatorStatus}</label>
      <div className="mini-profile-type">{I18n.t('MINI_PROFILE.OPERATOR')}</div>
      <div className="mini-profile-title">
        <span className="font-weight-700">{operatorData.firstName}{' '}{operatorData.lastName}</span>
      </div>
      <div className="mini-profile-ids">
        <Uuid uuid={operatorData.uuid} />
        {
          operatorData.country &&
          <span>{' - '}{operatorData.country}</span>
        }
      </div>
      {
        !!operatorData.authorities.length &&
        <div className="operator-mini-profile-role">
          {
            operatorData.authorities.map(authority =>
              <span key={authority.id} className="label label-black">
                <span className="label-department">
                  { renderLabel(authority.department, departmentsLabels) }
                </span>
                <span className="label-role">
                  { renderLabel(authority.role, rolesLabels) }
                </span>
              </span>
            )
          }
        </div>
      }
    </div>
  </div>
);

OperatorMiniProfile.propTypes = {
  operatorData: PropTypes.userProfile.isRequired,
};

export default OperatorMiniProfile;
