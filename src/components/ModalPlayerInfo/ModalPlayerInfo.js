import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
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
          className="d-inline-block"
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

  renderBalance = (profile) => {
    const { currency, tradingProfile: { balance, equity, margin, marginLevel } } = profile;

    return (
      <Fragment>
        <div className="header-block-middle">
          {currency} {Number(balance).toFixed(2)}
        </div>
        <div className="header-block-small">
          {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.EQUITY')}: {currency} {Number(equity).toFixed(2)}
        </div>
        <div className="header-block-small">
          {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.MARGIN')}: {currency} {Number(margin).toFixed(2)}
        </div>
        <div className="header-block-small">
          {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.MARGIN_LEVEL')}: {currency} {Number(marginLevel).toFixed(2)}
        </div>
      </Fragment>
    );
  };

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
              {this.renderBalance(playerProfile)}
            </div>
          </div>
        </Otherwise>
      </Choose>
    );
  }
}

export default ModalPlayerInfo;
