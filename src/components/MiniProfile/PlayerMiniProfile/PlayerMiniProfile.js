import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import Uuid from '../../Uuid';
import Amount from '../../Amount';
import './PlayerMiniProfile.scss';

const PlayerMiniProfile = ({ playerData }) => (
  <div className={`mini-profile mini-profile_${playerData.profileStatus}`}>
    <div className="mini-profile-header">
      <label className="mini-profile-label">{playerData.profileStatus}</label>
      <div className="mini-profile-type">{I18n.t('MINI_PROFILE.PLAYER')}</div>
      <div className="mini-profile-title">
        <span className="font-weight-700">{playerData.fullName}</span> ({playerData.age})
        {playerData.kycCompleted && <i className="fa fa-check text-success margin-left-5" />}
        <i className="note-icon note-pinned-note" />
      </div>
      <div className="mini-profile-ids">
        <span className="mini-profile-username">{playerData.username}</span>
        {' - '}
        {
          !!playerData.playerUUID &&
          <Uuid
            uuid={playerData.playerUUID}
            uuidPrefix={playerData.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
          />
        }
        {' - '}
        {playerData.languageCode}
      </div>
      {
        playerData.tags !== 0 &&
        <div className="mini-profile-tags">
          {playerData.tags.map(({ tag, id, priority }) =>
            <span className={`mini-profile-tag mini-profile-tag_${priority}`} key={id}>{tag}</span>
          )}
        </div>
      }
    </div>
    {
      (playerData.profileStatus === 'BLOCKED' || playerData.profileStatus === 'SUSPENDED') &&
      <div className="mini-profile-status-reason">
        <div className="info-block">
          <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.STATUS_REASON')}</div>
          <div className="info-block_status-reason_body">{playerData.profileStatusReason}</div>
        </div>
      </div>
    }
    <div className="mini-profile-content">
      <div className="info-block">
        <div className="info-block-label">{I18n.t('MINI_PROFILE.BALANCE')}</div>
        <div className="info-block-content"><Amount {...playerData.balances.total} /></div>
      </div>
      <div className="info-block">
        <div className="info-block-label">{I18n.t('MINI_PROFILE.LAST_LOGIN')}</div>
        <div className="info-block-content">
          1 month 10 days ago
        </div>
      </div>
      {
        playerData.lastDeposit !== null &&
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.DEPOSITED')}</div>
          <div className="info-block-content">
            {moment.utc(playerData.lastDeposit.transactionDate).local().fromNow()}
          </div>
        </div>
      }
      <div className="info-block">
        <div className="info-block-label">{I18n.t('MINI_PROFILE.REGISTERED')}</div>
        <div className="info-block-content">{moment.utc(playerData.registrationDate).local().fromNow()}</div>
      </div>
    </div>
  </div>
);

PlayerMiniProfile.propTypes = {
  playerData: PropTypes.userProfile.isRequired,
};

export default PlayerMiniProfile;
