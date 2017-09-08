import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import Amount from '../Amount';
import { statusColorNames } from '../../constants/user';
import PropTypes from '../../constants/propTypes';
import Uuid from '../Uuid';

class ModalPlayerInfo extends Component {
  static propTypes = {
    playerProfile: PropTypes.userProfile.isRequired,
  };

  renderPlayerInfo = profile => (
    <div>
      <div className="modal-header-tabs__label">
        <span>
          {[profile.firstName, profile.lastName].join(' ')}
        </span>
        {' '}
        {!!profile.birthDate && <span>({moment.utc().local().diff(profile.birthDate, 'years')})</span>}
      </div>
      <div className="font-size-11">
        {profile.username}
        {' - '}
        <Uuid
          uuid={profile.playerUUID}
          uuidPrefix={profile.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
        />
      </div>
    </div>
  );

  renderPlayerStatus = profile => (
    <div>
      <div className={`text-uppercase modal-header-tabs__label ${statusColorNames[profile.profileStatus]}`}>
        {profile.profileStatus}
      </div>
      {
        !!profile.suspendEndDate &&
        <div className="font-size-11">
          Until {moment.utc(profile.suspendEndDate).local().format('L')}
        </div>
      }
    </div>
  );

  renderBalance = ({ total, bonus, real }) => (
    <div>
      <Amount tag="div" className={'modal-header-tabs__label'} {...total} />
      <div className="font-size-11">
        RM <Amount {...real} /> + BM <Amount {...bonus} />
      </div>
    </div>
  );

  render() {
    const { playerProfile } = this.props;

    return (
      <div className="modal-header-tabs">
        <div className="modal-header-tabs__item">
          <div className="modal-tab-label">
            {I18n.t('COMMON.PLAYER')}
          </div>

          {this.renderPlayerInfo(playerProfile)}
        </div>
        <div className="modal-header-tabs__item">
          <div className="modal-tab-label">
            {I18n.t('COMMON.ACCOUNT_STATUS')}
          </div>

          {this.renderPlayerStatus(playerProfile)}
        </div>
        <div className="modal-header-tabs__item">
          <div className="modal-tab-label">
            {I18n.t('COMMON.BALANCE')}
          </div>

          {this.renderBalance(playerProfile.balances)}
        </div>
      </div>
    );
  }
}

export default ModalPlayerInfo;
