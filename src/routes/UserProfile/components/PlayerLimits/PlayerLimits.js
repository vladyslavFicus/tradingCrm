import React, { Component } from 'react';
import { Dropdown, DropdownMenu } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../constants/propTypes';
import { types, actions, reasons } from '../../../../constants/wallet';
import PlayerLimitsModal from './PlayerLimitsModal';
import ConfirmActionModal from '../../../../components/Modal/ConfirmActionModal';
import './PlayerLimits.scss';
import permissions from '../../../../config/permissions';
import PermissionContent from '../../../../components/PermissionContent';
import PlayerLimitButton from './PlayerLimitButton';
import PlayerLimit from './PlayerLimit';

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
            <PermissionContent permissions={permissions.USER_PROFILE.GET_PAYMENT_LOCKS}>
              <div>
                {this.renderStatus('Deposit', deposit.locked)}
                {this.renderStatus('Withdrawal', withdraw.locked)}
              </div>
            </PermissionContent>
            <PermissionContent permissions={permissions.USER_PROFILE.GET_LOGIN_LOCK}>
              {this.renderStatus('Login', login.locked)}
            </PermissionContent>
          </div>

          <DropdownMenu>
            <div className="header-block_player-limits_btn-group">
              <PermissionContent permissions={permissions.USER_PROFILE.LOCK_DEPOSIT}>
                <PlayerLimitButton
                  className="btn btn-danger-outline margin-right-10"
                  canUnlock={deposit.canUnlock}
                  label="deposit"
                  onClick={() => this.handleActionClick(
                    types.DEPOSIT,
                    deposit.canUnlock ? actions.UNLOCK : actions.LOCK
                  )}
                />
              </PermissionContent>
              <PermissionContent permissions={permissions.USER_PROFILE.LOCK_WITHDRAW}>
                <PlayerLimitButton
                  className="btn btn-danger-outline"
                  canUnlock={deposit.canUnlock}
                  label="withdrawal"
                  onClick={() => this.handleActionClick(
                    types.WITHDRAW,
                    withdraw.canUnlock ? actions.UNLOCK : actions.LOCK
                  )}
                />
              </PermissionContent>
            </div>
            {
              (entities.length > 0 || login.locked) &&
              <div className="limits-info">
                <PermissionContent permissions={permissions.USER_PROFILE.GET_PAYMENT_LOCKS}>
                  <div className={classNames({ 'no-margin': entities.length < 1 })}>
                    {entities.map(limit => (
                      <PlayerLimit
                        key={limit.id}
                        label={limit.type}
                        authorUUID={limit.authorUUID}
                        reason={limit.reason}
                        date={limit.startLock}
                      />
                    ))}
                  </div>
                </PermissionContent>
                <PermissionContent permissions={permissions.USER_PROFILE.GET_LOGIN_LOCK}>
                  {
                    login.locked &&
                    <PlayerLimit
                      label="Login"
                      reason={I18n.t('PLAYER_PROFILE.LOCKS.LOGIN.REASON')}
                      unlockButtonLabel="Login"
                      unlockButtonClassName="btn btn-danger-outline limits-info_tab-button"
                      onUnlockButtonClick={this.handleUnlockLoginClick}
                      endDate={login.expirationDate}
                    />
                  }
                </PermissionContent>
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
