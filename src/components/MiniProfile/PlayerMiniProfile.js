import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Uuid from '../Uuid';
import Amount from '../Amount';
import './MiniProfile.scss';

const PlayerMiniProfile = ({ playerProfile, accumulatedBalances, lastIp }) => (
  <div className={`mini-profile mini-profile_${playerProfile.profileStatus}`}>
    <div className="mini-profile-header">
      <label className="mini-profile-label">{playerProfile.profileStatus}</label>
      <div className="mini-profile-type">Player</div>
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
      <div className="mini-profile-tags">
        <span className="mini-profile-tag mini-profile-tag_danger">
          Very bad tag
        </span>
        <span className="mini-profile-tag mini-profile-tag_danger">
            One more bad tag
        </span>
        <span className="mini-profile-tag mini-profile-tag_success">
            Текст зеленого тега
        </span>
      </div>
    </div>
    {
      playerProfile.profileStatusReason.length > 0 &&
      <div className="mini-profile-status-reason">
        <div className="info-block">
          <div className="info-block_status-reason">status reason</div>
          <div className="info-block_status-reason_body">{playerProfile.profileStatusReason}</div>
        </div>
      </div>
    }
    <div className="mini-profile-content">
      <div className="info-block">
        <div className="info-block-label">balance</div>
        <div className="info-block-content"><Amount {...accumulatedBalances.total} /></div>
      </div>
      <div className="info-block">
        <div className="info-block-label">last login</div>
        <div className="info-block-content">
          {lastIp.sessionStart && moment.utc(lastIp.sessionStart).local().fromNow()}
        </div>
      </div>
      {/*<div className="info-block">
        <div className="info-block-label">deposited</div>
        <div className="info-block-content">1 Month, 10 Days ago</div>
      </div>*/}
      <div className="info-block">
        <div className="info-block-label">registered</div>
        <div className="info-block-content">{moment.utc(playerProfile.registrationDate).local().fromNow()}</div>
      </div>
    </div>
  </div>
);

PlayerMiniProfile.propTypes = {
  playerProfile: PropTypes.userProfile.isRequired,
  accumulatedBalances: PropTypes.shape({
    real: PropTypes.price,
    bonus: PropTypes.price,
    total: PropTypes.price,
  }).isRequired,
  lastIp: PropTypes.ipEntity,
};
PlayerMiniProfile.defaultProps = {
  lastIp: null,
};

export default PlayerMiniProfile;
