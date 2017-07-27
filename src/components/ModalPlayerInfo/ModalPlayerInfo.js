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
  static defaultProps = {
    balances: null,
  };

  renderPlayerInfo = profile => (
    <div className="line-height-1">
      <span className="font-weight-600 text-capitalize font-size-14">
        {[profile.firstName, profile.lastName].join(' ')}
      </span>
      {' '}
      {!!profile.birthDate && <div>({moment().diff(profile.birthDate, 'years')})</div>}
      <span className="little-grey-text font-size-11">
        {profile.username}
        {' - '}
        <Uuid
          uuid={profile.playerUUID}
          uuidPrefix={profile.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
        />
      </span>
    </div>
  );

  renderPlayerStatus = profile => (
    <div>
      <div className={`font-weight-600 text-uppercase ${statusColorNames[profile.profileStatus]}`}>
        {profile.profileStatus}
      </div>
      {
        !!profile.suspendEndDate &&
        <div className="color-default font-size-11">
          Until {moment(profile.suspendEndDate).format('L')}
        </div>
      }
    </div>
  );

  renderBalance = ({ total, bonus, real }) => (
    <div>
      <Amount tag="div" className={'font-weight-600 text-uppercase'} {...total} />
      <div className="little-grey-text font-size-11">
        RM <Amount {...real} /> + BM <Amount {...bonus} />
      </div>
    </div>
  );

  render() {
    const { playerProfile } = this.props;

    return (
      <div className="row player-header-blocks margin-bottom-10 equal">
        <div className="col-sm-4 equal-in">
          <div className="color-default text-uppercase font-size-11">
            {I18n.t('COMMON.PLAYER')}
          </div>

          {this.renderPlayerInfo(playerProfile)}
        </div>
        <div className="col-sm-4 equal-in">
          <div className="color-default text-uppercase font-size-11">
            {I18n.t('COMMON.ACCOUNT_STATUS')}
          </div>

          {this.renderPlayerStatus(playerProfile)}
        </div>
        <div className="col-sm-4 equal-in">
          <div className="color-default text-uppercase font-size-11">
            {I18n.t('COMMON.BALANCE')}
          </div>

          {this.renderBalance(playerProfile.balances)}
        </div>
      </div>
    );
  }
}

export default ModalPlayerInfo;
