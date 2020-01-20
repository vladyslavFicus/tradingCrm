import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { get } from 'lodash';
import classNames from 'classnames';
import { getActiveBrandConfig } from 'config';
import PropTypes from 'constants/propTypes';
import renderLabel from 'utils/renderLabel';
import NoteIcon from 'components/NoteIcon';
import { statuses } from 'constants/user';
import Amount from 'components/Amount';
import Uuid from 'components/Uuid';
import ShortLoader from 'components/ShortLoader';
import { withRequests } from 'apollo';
import { userStatusNames } from '../constants';
import PlayerMiniProfileQuery from './graphql/PlayerMiniProfileQuery';

const PlayerMiniProfile = ({ miniProfile: { data, loading } }) => {
  if (loading) {
    return (
      <div className="mini-profile-loader mini-profile-loader-player">
        <ShortLoader height={40} />
      </div>
    );
  }

  const {
    newProfile: {
      data: {
        registrationDetails: { registrationDate },
        profileView: {
          lastSignInSessions,
          balance: { amount },
        },
        kyc: { status: KYCStatus },
        status: { type: statusType, reason },
        languageCode,
        firstName,
        lastName,
        uuid,
        age,
      },
    },
  } = data;

  const currency = getActiveBrandConfig().currencies.base;
  const lastLogin = (lastSignInSessions && lastSignInSessions.length)
    ? lastSignInSessions[lastSignInSessions.length - 1].startedAt
    : null;
  const lastDepositTime = get(data, 'profileView.paymentDetails.lastDepositTime', null);

  return (
    <div className={classNames('mini-profile mini-profile', userStatusNames[statusType])}>
      <div className="mini-profile-header">
        <label className="mini-profile-label">{renderLabel(statusType, userStatusNames)}</label>
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.PLAYER')}</div>
        <div className="mini-profile-title">
          <span className="font-weight-700">{`${firstName} ${lastName}`}</span> {age && `(${age})`}
          {KYCStatus === 'APPROVED' && <i className="fa fa-check text-success margin-left-5" />}
          <NoteIcon type="pinned" className="mini-profile__note-icon" />
        </div>
        <div className="mini-profile-ids">
          <span className="mini-profile-username">{firstName}</span>
          {' - '}
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
      <div className="mini-profile-content">
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.BALANCE')}</div>
          <div className="info-block-content">
            <Amount amount={amount} currency={currency} />
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.LAST_LOGIN')}</div>
          <div className="info-block-content">
            {lastLogin
              ? moment.utc(lastLogin).local().fromNow()
              : I18n.t('COMMON.UNAVAILABLE')}
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.DEPOSITED')}</div>
          <div className="info-block-content">
            {lastDepositTime
              ? moment.utc(lastDepositTime).local().fromNow()
              : I18n.t('COMMON.NEVER')}
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.REGISTERED')}</div>
          <div className="info-block-content">
            {moment.utc(registrationDate).local().fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
};

PlayerMiniProfile.propTypes = {
  miniProfile: PropTypes.shape({
    data: PropTypes.shape({
      playerMiniProfile: PropTypes.shape({
        data: PropTypes.newProfile,
      }),
    }),
    loading: PropTypes.bool.isRequired,
  }).isRequired,
};

export default withRequests({
  miniProfile: PlayerMiniProfileQuery,
})(PlayerMiniProfile);
