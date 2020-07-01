import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import Uuid from 'components/Uuid';
import { departmentsLabels, rolesLabels } from 'constants/operators';
import PropTypes from 'constants/propTypes';
import renderLabel from 'utils/renderLabel';
import ShortLoader from 'components/ShortLoader';
import OperatorMiniProfileQuery from './graphql/OperatorMiniProfileQuery';
import { operatorStatusNames } from '../constants';

const OperatorMiniProfile = ({ miniProfile: { data, loading } }) => {
  if (loading) {
    return (
      <div className="mini-profile-loader mini-profile-loader-operator">
        <ShortLoader />
      </div>
    );
  }

  const {
    operator: {
      data: {
        authorities,
        registrationDate,
        operatorStatus,
        fullName,
        country,
        uuid,
      },
    },
  } = data;

  return (
    <div className={classNames('mini-profile', operatorStatusNames[operatorStatus])}>
      <div className="mini-profile-header">
        <label className="mini-profile-label">{operatorStatus}</label>
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.OPERATOR')}</div>
        <div className="mini-profile-title">
          <span className="font-weight-700">{fullName}</span>
        </div>
        <div className="mini-profile-ids">
          <Uuid uuid={uuid} />
          {country && <span>{` - ${country}`}</span>}
        </div>
        {authorities.length && (
          <div className="mini-profile-departments">
            {authorities.map(authority => (
              <div className="mini-profile-department" key={authority.id}>
                <span className="font-weight-700">{I18n.t(renderLabel(authority.department, departmentsLabels))}</span>
                {' - '}
                <span>{I18n.t(renderLabel(authority.role, rolesLabels))}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mini-profile-content">
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.REGISTERED')}</div>
          <div className="info-block-content">
            <div className="info-block-heading">
              {moment.utc(registrationDate).local().fromNow()}
            </div>
            <div className="info-block-description">
              {I18n.t('COMMON.DATE_ON', {
                date: moment.utc(registrationDate).local().format('DD.MM.YYYY HH:mm'),
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

OperatorMiniProfile.propTypes = {
  miniProfile: PropTypes.shape({
    data: PropTypes.shape({
      operator: PropTypes.operatorProfile,
    }).isRequired,
    loading: PropTypes.bool.isRequired,
  }),
};

OperatorMiniProfile.defaultProps = {
  miniProfile: {
    data: {},
    loading: true,
  },
};

export default withRequests({
  miniProfile: OperatorMiniProfileQuery,
})(OperatorMiniProfile);
