import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import Uuid from '../../Uuid';
import Amount from '../../Amount';
import { statuses } from '../../../constants/user';
import { userStatusNames } from '../constants';
import './PlayerMiniProfile.scss';

const PlayerMiniProfile = ({ data }) => {
  let lastLogin = null;

  if (data.signInIps.length) {
    lastLogin = data.signInIps[0].sessionStart;
  }

  return (
    <div className={classNames('mini-profile mini-profile', userStatusNames[data.profileStatus])}>
      <div className="mini-profile-header">
        <label className="mini-profile-label">{data.profileStatus}</label>
        <div className="mini-profile-type">{I18n.t('MINI_PROFILE.PLAYER')}</div>
        <div className="mini-profile-title">
          <span className="font-weight-700">{data.fullName}</span> ({data.age})
          {data.kycCompleted && <i className="fa fa-check text-success margin-left-5" />}
          <i className="note-icon note-pinned-note" />
        </div>
        <div className="mini-profile-ids">
          <span className="mini-profile-username">{data.username}</span>
          {' - '}
          {
            !!data.playerUUID &&
            <Uuid
              uuid={data.playerUUID}
              uuidPrefix={data.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
            />
          }
          {` - ${data.languageCode}`}
        </div>
        {
          data.tags && Array.isArray(data.tags) &&
          <div className="mini-profile-tags">
            {data.tags.map(({ tag, id, priority }) =>
              <span className={`mini-profile-tag mini-profile-tag_${priority}`} key={id}>{tag}</span>
            )}
          </div>
        }
      </div>
      {
        (data.profileStatus === statuses.BLOCKED || data.profileStatus === statuses.SUSPENDED) &&
        <div className="mini-profile-status-reason">
          <div className="info-block">
            <div className="info-block_status-reason">{I18n.t('MINI_PROFILE.STATUS_REASON')}</div>
            <div className="info-block_status-reason_body">{data.profileStatusReason}</div>
          </div>
        </div>
      }
      <div className="mini-profile-content">
        <div className="info-block">
          <div className="info-block-label">{I18n.t('MINI_PROFILE.BALANCE')}</div>
          <div className="info-block-content"><Amount {...data.balances.total} /></div>
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
  data: PropTypes.userProfile.isRequired,
};

export default PlayerMiniProfile;
