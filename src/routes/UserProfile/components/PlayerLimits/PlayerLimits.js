import React, { Component } from 'react';
import { Dropdown, DropdownMenu } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../constants/propTypes';
import { types, actions, reasons } from '../../../../constants/wallet';
import PlayerLimitsModal from './PlayerLimitsModal';
import ConfirmActionModal from '../../../../components/Modal/ConfirmActionModal';
import Uuid from '../../../../components/Uuid';
import './PlayerLimits.scss';

const PLAYER_LIMITS_MODAL = 'player-limits-modal';
const PLAYER_LOGIN_LIMIT_MODAL = 'player-login-limit-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class PlayerLimits extends Component {
  static propTypes = {
    profile: PropTypes.userProfile.isRequired,
    limits: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.playerLimitEntity).isRequired,
      deposit: PropTypes.shape({
        locked: PropTypes.bool.isRequired,
        canUnlock: PropTypes.bool.isRequired,
      }).isRequired,
      withdraw: PropTypes.shape({
        locked: PropTypes.bool.isRequired,
        canUnlock: PropTypes.bool.isRequired,
      }).isRequired,
      login: PropTypes.shape({
        locked: PropTypes.bool.isRequired,
        expirationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      }).isRequired,
      error: PropTypes.object,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    unlockLogin: PropTypes.func.isRequired,
  };

  state = {
    dropDownOpen: false,
    modal: { ...modalInitialState },
  };

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
  };

  handleActionClick = (type, action) => {
    this.handleOpenModal(PLAYER_LIMITS_MODAL, {
      title: `${action.toLowerCase()} player's ${type}`,
      initialValues: {
        action,
        type,
      },
      type: type.toUpperCase(),
      action,
      reasons: reasons[action],
    });
  };

  handleModalHide = (e, callback) => {
    this.setState({
      modal: { ...modalInitialState },
    }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  handleSubmit = (data) => {
    this.handleModalHide(null, () => this.props.onChange(data));
  };

  handleUnlockLogin = () => this.handleModalHide(null, () => this.props.unlockLogin());

  handleOpenModal = (name, params) => {
    this.setState({
      modal: {
        name,
        params,
      },
    });
  };

  handleUnlockLoginClick = () => {
    const { profile: { fullName, playerUUID } } = this.props;

    this.handleOpenModal(PLAYER_LOGIN_LIMIT_MODAL, {
      onSubmit: this.handleUnlockLogin,
      uuid: playerUUID,
      uuidPrefix: 'PL',
      modalTitle: I18n.t('PLAYER_PROFILE.LOCKS.LOGIN.MODAL.TITLE'),
      actionText: I18n.t('PLAYER_PROFILE.LOCKS.LOGIN.MODAL.ACTION_TEXT', { fullName }),
      submitButtonLabel: I18n.t('PLAYER_PROFILE.LOCKS.LOGIN.MODAL.SUBMIT_BUTTON_LABEL'),
    });
  };

  renderStatus = (label, locked) => {
    const className = locked
      ? 'header-block_player-limits-tab_status_is-locked'
      : 'header-block_player-limits-tab_status_is-allowed';

    return (
      <div className="header-block_player-limits-tab_status">
        {label} - <span className={className}>
          {locked ? 'Locked' : 'Allowed'}
        </span>
      </div>
    );
  };

  renderButton = (label, canUnlock, className, onChange) => (
    <button type="button" className={className} onClick={onChange}>
      {canUnlock ? 'Unlock' : 'Lock'} {label}
    </button>
  );

  renderLimit = limit => (
    <div key={limit.id} className="limits-info_tab">
      <div className="header-block_player-limits-tab_status">
        {limit.type} - <span className="header-block_player-limits-tab_status_is-locked">Locked</span>
      </div>
      {
        limit.authorUUID &&
        <div className="header-block_player-limits-tab_log">
          by <Uuid uuid={limit.authorUUID} />
        </div>
      }
      <div className="header-block_player-limits-tab_log">Reason - {limit.reason}</div>
      {
        limit.startLock && moment(limit.startLock).isValid() &&
        <div className="header-block_player-limits-tab_log">
          on {moment.utc(limit.startLock).local().format('DD.MM.YYYY HH:mm')}
        </div>
      }
    </div>
  );

  renderLoginLimit = () => {
    const { limits: { login } } = this.props;

    if (!login.locked) {
      return null;
    }

    return (
      <div className="limits-info_tab">
        <div className="header-block_player-limits-tab_status">
          Login - <span className="header-block_player-limits-tab_status_is-locked">Locked</span>
        </div>
        <div className="header-block_player-limits-tab_log">
          {I18n.t('PLAYER_PROFILE.LOCKS.LOGIN.REASON')}
        </div>
        <div className="header-block_player-limits-tab_log">
          {I18n.t('COMMON.DATE_UNTIL', {
            date: moment(login.expirationDate).format('DD.MM.YYYY HH:mm') })
          }
        </div>
        {
          this.renderButton(
            'login',
            true,
            'btn btn-danger-outline limits-info_tab-button',
            this.handleUnlockLoginClick,
          )
        }
      </div>
    );
  }

  render() {
    const { dropDownOpen, modal } = this.state;
    const { limits: { entities, deposit, withdraw, login }, profile } = this.props;
    const className = classNames('dropdown-highlight cursor-pointer', {
      'dropdown-open': dropDownOpen,
    });

    return (
      <div className={className}>
        <Dropdown isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
          <div className="header-block_player-limits-tab">
            <div className="header-block-title">Locks</div>
            {this.renderStatus('Deposit', deposit.locked)}
            {this.renderStatus('Withdrawal', withdraw.locked)}
            {login.locked && this.renderStatus('Login', true)}
          </div>

          <DropdownMenu>
            <div className="header-block_player-limits_btn-group">
              {this.renderButton(
                'deposit',
                deposit.canUnlock,
                'btn btn-danger-outline margin-right-10',
                this.handleActionClick.bind(null, types.DEPOSIT, deposit.canUnlock ? actions.UNLOCK : actions.LOCK),
              )}
              {this.renderButton(
                'withdrawal',
                withdraw.canUnlock,
                'btn btn-danger-outline',
                this.handleActionClick.bind(null, types.WITHDRAW, withdraw.canUnlock ? actions.UNLOCK : actions.LOCK),
              )}
            </div>
            {
              entities.length > 0 &&
              <div className="limits-info">
                {entities.map(this.renderLimit)}
                {this.renderLoginLimit()}
              </div>
            }
          </DropdownMenu>
        </Dropdown>

        {
          modal.name === PLAYER_LIMITS_MODAL &&
          <PlayerLimitsModal
            {...modal.params}
            onSubmit={this.handleSubmit}
            onHide={this.handleModalHide}
            profile={profile}
          />
        }
        {
          modal.name === PLAYER_LOGIN_LIMIT_MODAL &&
          <ConfirmActionModal
            {...modal.params}
            form="confirmUnlockLogin"
            onClose={this.handleModalHide}
          />
        }
      </div>
    );
  }
}

export default PlayerLimits;
