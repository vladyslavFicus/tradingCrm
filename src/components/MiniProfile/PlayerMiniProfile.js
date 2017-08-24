import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import Uuid from '../Uuid';
import Amount from '../Amount';
import './MiniProfile.scss';

const PlayerMiniProfile = ({ playerProfile }) => (
  <div className={`mini-profile mini-profile_${playerProfile.profileStatus}`}>
    <div className="mini-profile-header">
      <label className="mini-profile-label">{playerProfile.profileStatus}</label>
      <div className="mini-profile-type">{I18n.t('MINI_PROFILE.PLAYER')}</div>
      <div className="mini-profile-title">
        <b>{playerProfile.fullName}</b> ({playerProfile.age})
        {playerProfile.kycCompleted && <i className="fa fa-check text-success margin-left-5" />}
        <i className="note-icon note-pinned-note" />
      </div>
      <div className="mini-profile-ids">
        <span className="mini-profile-username">{playerProfile.username}</span>
        {' - '}
        {
          !!playerProfile.playerUUID &&
          <Uuid
            uuid={playerProfile.playerUUID}
            uuidPrefix={playerProfile.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
          />
        }
        {' - '}
        {playerProfile.languageCode}
      </div>
      {
        playerProfile.tags !== 0 &&
        <div className="mini-profile-tags">
          {playerProfile.tags.map(({ tag, id, priority }) =>
            <span className={`mini-profile-tag mini-profile-tag_${priority}`} key={id}>{tag}</span>
          )}
        </div>
      }
    </div>
    {
      (playerProfile.profileStatus === 'BLOCKED' || playerProfile.profileStatus === 'SUSPENDED') &&
      <div className="mini-profile-status-reason">
        <div className="info-block">
          <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.STATUS_REASON')}</div>
          <div className="info-block_status-reason_body">{playerProfile.profileStatusReason}</div>
        </div>
      </div>
    }
    <div className="mini-profile-content">
      <div className="info-block">
        <div className="info-block-label">{I18n.t('MINI_PROFILE.BALANCE')}</div>
        <div className="info-block-content"><Amount {...playerProfile.balances.total} /></div>
      </div>
      <div className="info-block">
        <div className="info-block-label">{I18n.t('MINI_PROFILE.LAST_LOGIN')}</div>
        <div className="info-block-content">
          1 month 10 days ago
        </div>
      </div>
      {
        playerProfile.lastDeposit !== null &&
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.DEPOSITED')}</div>
          <div className="info-block-content">
            {moment.utc(playerProfile.lastDeposit.transactionDate).local().fromNow()}
          </div>
        </div>
      }
      <div className="info-block">
        <div className="info-block-label">{I18n.t('MINI_PROFILE.REGISTERED')}</div>
        <div className="info-block-content">{moment.utc(playerProfile.registrationDate).local().fromNow()}</div>
      </div>
    </div>
  </div>
);

PlayerMiniProfile.propTypes = {
  playerProfile: PropTypes.userProfile.isRequired,
};

export default PlayerMiniProfile;
