import React from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import { getActiveBrandConfig } from 'config';
import PropTypes from '../../../constants/propTypes';
import Uuid from '../../Uuid';
import Amount from '../../Amount';
import { statuses } from '../../../constants/user';
import { userStatusNames } from '../constants';
import renderLabel from '../../../utils/renderLabel';
import NoteIcon from '../../NoteIcon';
import './PlayerMiniProfile.scss';

const PlayerMiniProfile = ({ data }) => {
  let lastLogin = null;

  if (data.signInIps.length) {
    lastLogin = data.signInIps[0].sessionStart;
  }

  const currency = getActiveBrandConfig().currencies.base;

  return (
    <div className={classNames('mini-profile mini-profile', userStatusNames[data.profileStatus])}>
      <div className="mini-profile-header">
        <label className="mini-profile-label">{renderLabel(data.profileStatus, userStatusNames)}</label>
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.PLAYER')}</div>
        <div className="mini-profile-title">
          <span className="font-weight-700">{data.fullName}</span> ({data.weight})
          {data.kycCompleted && <i className="fa fa-check text-success margin-left-5" />}
          <NoteIcon type="pinned" className="mini-profile__note-icon" />
        </div>
        <div className="mini-profile-ids">
          <span className="mini-profile-username">{data.username}</span>
          {' - '}
          <Uuid
            uuid={data.playerUUID}
            uuidPrefix={data.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
          />
          {` - ${data.languageCode}`}
        </div>
      </div>
      {
        (data.profileStatus === statuses.BLOCKED || data.profileStatus === statuses.SUSPENDED)
        && (
          <div className="mini-profile-status-reason">
            <div className="info-block">
              <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.STATUS_REASON')}</div>
              <div className="info-block_status-reason_body">
                {I18n.t(data.profileStatusReason)}
              </div>
            </div>
          </div>
        )
      }
      <div className="mini-profile-content">
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.BALANCE')}</div>
          <div className="info-block-content">
            <Amount
              amount={data.tradingProfile.baseCurrencyBalance}
              currency={currency}
            />
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.LAST_LOGIN')}</div>
          <div className="info-block-content">
            {
              !lastLogin
                ? I18n.t('COMMON.UNAVAILABLE')
                : moment.utc(lastLogin).local().fromNow()
            }
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.DEPOSITED')}</div>
          <div className="info-block-content">
            {
              !data.lastDeposit
                ? I18n.t('COMMON.NEVER')
                : moment.utc(data.lastDeposit.transactionDate).local().fromNow()
            }
          </div>
        </div>
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.REGISTERED')}</div>
          <div className="info-block-content">{moment.utc(data.registrationDate).local().fromNow()}</div>
        </div>
      </div>
    </div>
  );
};

PlayerMiniProfile.propTypes = {
  data: PropTypes.shape({
    playerUUID: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    languageCode: PropTypes.string.isRequired,
    kycCompleted: PropTypes.string,
    fullName: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    profileStatus: PropTypes.string.isRequired,
    profileStatusReason: PropTypes.string,
    balances: PropTypes.shape({
      total: PropTypes.price.isRequired,
    }).isRequired,
    signInIps: PropTypes.arrayOf(PropTypes.shape({
      sessionStart: PropTypes.string.isRequired,
    })),
    lastDeposit: PropTypes.shape({
      transactionDate: PropTypes.string.isRequired,
    }).isRequired,
    registrationDate: PropTypes.string.isRequired,
  }).isRequired,
};

export default PlayerMiniProfile;
