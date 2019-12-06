import React, { Component, Fragment } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { getActiveBrandConfig } from 'config';
import PropTypes from '../../constants/propTypes';
import Uuid from '../Uuid';
import './ModalPlayerInfo.scss';

class ModalPlayerInfo extends Component {
  static propTypes = {
    playerProfile: PropTypes.userProfile,
    renderMiddleColumn: PropTypes.func,
  };

  static defaultProps = {
    playerProfile: null,
    renderMiddleColumn: () => {},
  };

  renderPlayerInfo = ({ firstName, lastName, birthDate, username, uuid }) => (
    <Fragment>
      <div className="modal-header-tabs__label">
        {[firstName, lastName].join(' ')}
        {' '}
        {!!birthDate && <span>({moment().diff(birthDate, 'years')})</span>}
      </div>
      <div className="font-size-11">
        {username}
        {' - '}
        <Uuid
          uuid={uuid}
          uuidPrefix={uuid.indexOf('PLAYER') === -1 ? 'PL' : null}
          className="d-inline-block"
        />
      </div>
    </Fragment>
  );

  renderBalance = ({ profileView: { balance: { amount, credit } } }) => {
    const currency = getActiveBrandConfig().currencies.base;

    return (
      <Fragment>
        <div className="header-block-middle">
          {currency} {Number(amount).toFixed(2)}
        </div>
        <div className="header-block-small">
          {I18n.t('CLIENT_PROFILE.PROFILE.HEADER.CREDIT')}: {currency} {Number(credit).toFixed(2)}
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
                {I18n.t('COMMON.CLIENT')}
              </div>
              {this.renderPlayerInfo(playerProfile)}
            </div>
            {this.props.renderMiddleColumn()}
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
