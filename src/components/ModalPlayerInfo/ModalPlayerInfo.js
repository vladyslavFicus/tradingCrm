import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import Amount from '../Amount';
import { statusColorNames } from '../../constants/user';
import PropTypes from '../../constants/propTypes';
import Uuid from '../Uuid';
import './ModalPlayerInfo.scss';

class ModalPlayerInfo extends Component {
  static propTypes = {
    playerProfile: PropTypes.userProfile,
  };
  static defaultProps = {
    playerProfile: null,
  };

  renderPlayerInfo = profile => (
    <Fragment>
      <div className="modal-header-tabs__label">
        {[profile.firstName, profile.lastName].join(' ')}
        {' '}
        {!!profile.birthDate && <span>({moment().diff(profile.birthDate, 'years')})</span>}
      </div>
      <div className="font-size-11">
        {profile.username}
        {' - '}
        <Uuid
          uuid={profile.playerUUID}
          uuidPrefix={profile.playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null}
        />
      </div>
    </Fragment>
  );

  renderPlayerStatus = profile => (
    <Fragment>
      <div className={`text-uppercase modal-header-tabs__label ${statusColorNames[profile.profileStatus]}`}>
        {profile.profileStatus}
      </div>
      {
        !!profile.suspendEndDate &&
        <div className="font-size-11">
          Until {moment.utc(profile.suspendEndDate).local().format('L')}
        </div>
      }
    </Fragment>
  );

  renderBalance = ({ total, bonus, real }) => (
    <Fragment>
      <Amount tag="div" className="modal-header-tabs__label" {...total} />
      <div className="font-size-11">
        RM <Amount {...real} /> + BM <Amount {...bonus} />
      </div>
    </Fragment>
  );

  render() {
    const { playerProfile } = this.props;

    return (
      <Choose>
        <When condition={!playerProfile}>
          <div className="alert alert-danger" role="alert">
            <span className="font-weight-700">
              {I18n.t('PAYMENT_DETAILS_MODAL.PLAYER_NOT_FOUND.TITLE')}
            </span> {' '}
            <span>{I18n.t('PAYMENT_DETAILS_MODAL.PLAYER_NOT_FOUND.DESCRIPTION')}</span>
          </div>
        </When>
        <Otherwise>
          <div className="row modal-player-info">
            <div className="col">
              <div className="modal-tab-label">
                {I18n.t('COMMON.PLAYER')}
              </div>
              {this.renderPlayerInfo(playerProfile)}
            </div>
            <div className="col">
              <div className="modal-tab-label">
                {I18n.t('COMMON.ACCOUNT_STATUS')}
              </div>
              {this.renderPlayerStatus(playerProfile)}
            </div>
            <div className="col">
              <div className="modal-tab-label">
                {I18n.t('COMMON.BALANCE')}
              </div>
              {this.renderBalance(playerProfile.balances)}
            </div>
          </div>
        </Otherwise>
      </Choose>
    );
  }
}

export default ModalPlayerInfo;
