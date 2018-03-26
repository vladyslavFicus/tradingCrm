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
    profile: PropTypes.object,
    limits: PropTypes.shape({
      login: PropTypes.shape({
        lock: PropTypes.bool.isRequired,
        lockExpirationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        lockReason: PropTypes.string,
      }).isRequired,
      error: PropTypes.object,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    unlockLogin: PropTypes.func.isRequired,
  };

  static defaultProps = {
    profile: {},
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
    this.handleOpenModal(PLAYER_LOGIN_LIMIT_MODAL);
  };

  isPaymentLocked= (type) => {
    const { profile: { locks: { payment } } } = this.props;

    return payment.findIndex(i => i.type === type) !== -1;
  }

  canLocked= (type) => {
    const { profile: { locks: { payment: payments } } } = this.props;
    const payment = payments.find(i => i.type === type) || {};

    return !!payment.canUnlock;
  }

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
    const { profile } = this.props;

    if (!profile.locks) {
      return null;
    }

    const { locks: { payment, login } } = profile;
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
                {this.renderStatus('Deposit', this.isPaymentLocked('DEPOSIT'))}
                {this.renderStatus('Withdrawal', this.isPaymentLocked('WITHDRAW'))}
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
                  canUnlock={this.canLocked('DEPOSIT')}
                  label="deposit"
                  onClick={() => this.handleActionClick(
                    types.DEPOSIT,
                    this.canLocked('DEPOSIT') ? actions.UNLOCK : actions.LOCK
                  )}
                />
              </PermissionContent>
              <PermissionContent permissions={permissions.USER_PROFILE.LOCK_WITHDRAW}>
                <PlayerLimitButton
                  className="btn btn-danger-outline"
                  canUnlock={this.canLocked('WITHDRAW')}
                  label="withdrawal"
                  onClick={() => this.handleActionClick(
                    types.WITHDRAW,
                    this.canLocked('WITHDRAW') ? actions.UNLOCK : actions.LOCK
                  )}
                />
              </PermissionContent>
            </div>
            {
              (payment.length > 0 || login.locked) &&
              <div className="limits-info">
                <PermissionContent permissions={permissions.USER_PROFILE.GET_PAYMENT_LOCKS}>
                  <div className="limits-info_container locks-container">
                    {payment.map(limit => (
                      <PlayerLimit
                        key={limit.id}
                        label={limit.type}
                        authorUUID={limit.authorUUID}
                        reason={limit.reason}
                        date={limit.startLock}
                        profileStatus={profile.profileStatus}
                      />
                    ))}
                  </div>
                </PermissionContent>
                <PermissionContent permissions={permissions.USER_PROFILE.GET_LOGIN_LOCK}>
                  {
                    login.locked &&
                    <div className="limits-info_container">
                      <PlayerLimit
                        label="Login"
                        reason={I18n.t(login.reason)}
                        unlockButtonLabel="Login"
                        unlockButtonClassName="btn btn-danger-outline limits-info_tab-button"
                        onUnlockButtonClick={this.handleUnlockLoginClick}
                        endDate={login.expirationDate}
                        profileStatus={profile.profileStatus}
                      />
                    </div>
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
            onSubmit={this.handleUnlockLogin}
            onClose={this.handleModalHide}
            modalTitle={I18n.t('PLAYER_PROFILE.LOCKS.LOGIN.MODAL.TITLE')}
            actionText={I18n.t('PLAYER_PROFILE.LOCKS.LOGIN.MODAL.ACTION_TEXT')}
            fullName={profile.fullName}
            uuid={profile.playerUUID}
            submitButtonLabel={I18n.t('PLAYER_PROFILE.LOCKS.LOGIN.MODAL.SUBMIT_BUTTON_LABEL')}
          />
        }
      </div>
    );
  }
}

export default PlayerLimits;
