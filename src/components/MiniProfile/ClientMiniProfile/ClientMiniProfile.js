import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { get } from 'lodash';
import classNames from 'classnames';
import { getBrand } from 'config';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import renderLabel from 'utils/renderLabel';
import PermissionContent from 'components/PermissionContent';
import { statuses } from 'constants/user';
import Uuid from 'components/Uuid';
import ShortLoader from 'components/ShortLoader';
import { withRequests, parseErrors } from 'apollo';
import { userStatusNames } from '../constants';
import ClientMiniProfileQuery from './graphql/ClientMiniProfileQuery';

const ClientMiniProfile = ({ miniProfile }) => {
  const { data, error, loading } = miniProfile;

  if (loading) {
    return (
      <div className="mini-profile-loader mini-profile-loader-client">
        <ShortLoader />
      </div>
    );
  }

  if (parseErrors(error).error === 'error.profile.access.hierarchy.not-subordinate') {
    return (
      <div className="mini-profile-error">
        <div className="mini-profile-error-message">
          {I18n.t('MINI_PROFILE.NO_ACCESS.CLIENT')}
        </div>
      </div>
    );
  }

  const {
    profile: {
      registrationDetails: { registrationDate },
      profileView: {
        lastSignInSessions,
        balance,
      },
      kyc: { status: KYCStatus },
      status: { type: statusType, reason },
      languageCode,
      firstName,
      lastName,
      uuid,
      age,
    },
  } = data;

  const currency = getBrand().currencies.base;
  const lastLogin = (lastSignInSessions && lastSignInSessions.length)
    ? lastSignInSessions[lastSignInSessions.length - 1].startedAt
    : null;
  const lastDepositTime = get(data, 'profile.profileView.paymentDetails.lastDepositTime', null);

  return (
    <div className={classNames('mini-profile mini-profile', statusType.toLowerCase())}>
      <div className="mini-profile-header">
        <label className="mini-profile-label">{renderLabel(statusType, userStatusNames)}</label>
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.CLIENT')}</div>
        <div className="mini-profile-title">
          <span className="mini-profile-title-name">{`${firstName} ${lastName}`}</span> {age && `(${age})`}
          {KYCStatus === 'APPROVED' && <i className="fa fa-check text-success margin-left-5" />}
        </div>
        <div className="mini-profile-ids">
          <Uuid uuid={uuid} />
          {` - ${languageCode}`}
        </div>
      </div>
      {(statusType === statuses.BLOCKED || statusType === statuses.SUSPENDED) && (
        <div className="mini-profile-status-reason">
          <div className="info-block">
            <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.STATUS_REASON')}</div>
            <div className="info-block_status-reason_body">{I18n.t(reason)}</div>
          </div>
        </div>
      )}
      <table className="mini-profile-content">
        <tbody>
          <PermissionContent permissions={permissions.USER_PROFILE.BALANCE}>
            <tr className="info-block">
              <td className="info-block-label">{I18n.t('MINI_PROFILE.BALANCE')}</td>
              <td className="info-block-content">
                {I18n.toCurrency(balance?.amount, { unit: '' })} {currency}
              </td>
            </tr>
          </PermissionContent>
          <tr className="info-block">
            <td className="info-block-label">{I18n.t('MINI_PROFILE.LAST_LOGIN')}</td>
            <td className="info-block-content">
              {lastLogin
                ? moment.utc(lastLogin).local().fromNow()
                : I18n.t('COMMON.UNAVAILABLE')}
            </td>
          </tr>
          <tr className="info-block">
            <td className="info-block-label">{I18n.t('MINI_PROFILE.DEPOSITED')}</td>
            <td className="info-block-content">
              {lastDepositTime
                ? moment.utc(lastDepositTime).local().fromNow()
                : I18n.t('COMMON.NEVER')}
            </td>
          </tr>
          <tr className="info-block">
            <td className="info-block-label">{I18n.t('MINI_PROFILE.REGISTERED')}</td>
            <td className="info-block-content">
              {moment.utc(registrationDate).local().fromNow()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

ClientMiniProfile.propTypes = {
  miniProfile: PropTypes.shape({
    data: PropTypes.shape({
      profile: PropTypes.profile,
    }),
    error: PropTypes.shape({
      error: PropTypes.string,
    }),
    loading: PropTypes.bool.isRequired,
  }).isRequired,
};

export default withRequests({
  miniProfile: ClientMiniProfileQuery,
})(ClientMiniProfile);
