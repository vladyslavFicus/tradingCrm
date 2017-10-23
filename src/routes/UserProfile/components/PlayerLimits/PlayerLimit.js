import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import Uuid from '../../../../components/Uuid';
import PlayerLimitButton from './PlayerLimitButton';

class PlayerLimit extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    reason: PropTypes.string,
    authorUUID: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    unlockButtonLabel: PropTypes.string,
    unlockButtonClassName: PropTypes.string,
    onUnlockButtonClick: PropTypes.func,
  };
  static defaultProps = {
    reason: '',
    authorUUID: '',
    startDate: '',
    endDate: '',
    unlockButtonLabel: '',
    unlockButtonClassName: '',
    onUnlockButtonClick: null,
  };

  render() {
    const {
      label,
      reason,
      authorUUID,
      startDate,
      endDate,
      unlockButtonLabel,
      unlockButtonClassName,
      onUnlockButtonClick,
    } = this.props;
    const isUnlockButtonVisible = !!(unlockButtonLabel && unlockButtonClassName && onUnlockButtonClick);

    return (
      <div className="limits-info_tab">
        <div className="header-block_player-limits-tab_status">
          {label} - <span className="header-block_player-limits-tab_status_is-locked">Locked</span>
        </div>
        {
          authorUUID &&
          <div className="header-block_player-limits-tab_log">
            {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={authorUUID} />
          </div>
        }
        {
          reason &&
          <div className="header-block_player-limits-tab_log">
            {!isUnlockButtonVisible && <span>Reason - </span>}
            {reason}
          </div>
        }
        {
          startDate && moment(startDate).isValid() &&
          <div className="header-block_player-limits-tab_log">
            {I18n.t('COMMON.DATE_ON', { date: moment.utc(startDate).local().format('DD.MM.YYYY HH:mm') })}
          </div>
        }
        {
          endDate && moment(endDate).isValid() &&
          <div className="header-block_player-limits-tab_log">
            {I18n.t('COMMON.DATE_UNTIL', { date: moment.utc(endDate).local().format('DD.MM.YYYY HH:mm') })}
          </div>
        }
        {
          isUnlockButtonVisible &&
          <PlayerLimitButton
            className={unlockButtonClassName}
            canUnlock
            label={unlockButtonLabel}
            onClick={onUnlockButtonClick}
          />
        }
      </div>
    );
  }
}

export default PlayerLimit;
