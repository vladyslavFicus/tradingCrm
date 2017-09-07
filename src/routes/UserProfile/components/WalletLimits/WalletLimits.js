import React, { Component } from 'react';
import { Dropdown, DropdownMenu } from 'reactstrap';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from '../../../../constants/propTypes';
import { types, actions, reasons } from '../../../../constants/wallet';
import WalletLimitsModal from './WalletLimitsModal';
import Uuid from '../../../../components/Uuid';
import './WalletLimits.scss';

const initialState = {
  dropDownOpen: false,
  modal: {
    show: false,
    params: {},
  },
};

class WalletLimits extends Component {
  static propTypes = {
    profile: PropTypes.userProfile.isRequired,
    limits: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.walletLimitEntity).isRequired,
      deposit: PropTypes.shape({
        locked: PropTypes.bool.isRequired,
        canUnlock: PropTypes.bool.isRequired,
      }).isRequired,
      withdraw: PropTypes.shape({
        locked: PropTypes.bool.isRequired,
        canUnlock: PropTypes.bool.isRequired,
      }).isRequired,
      error: PropTypes.object,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = { ...initialState };

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
  };

  handleActionClick = (type, action) => {
    this.setState({
      modal: {
        show: true,
        params: {
          title: `${action.toLowerCase()} player's ${type}`,
          initialValues: {
            action,
            type,
          },
          type: type.toUpperCase(),
          action,
          reasons: reasons[action],
        },
      },
    });
  };

  handleModalHide = (e, callback) => {
    this.setState({
      modal: { ...initialState.modal },
    }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  handleSubmit = (data) => {
    this.handleModalHide(null, () => this.props.onChange(data));
  };

  renderStatus = (label, locked) => {
    const className = locked
      ? 'header-block_wallet-limits-tab_status_is-locked'
      : 'header-block_wallet-limits-tab_status_is-allowed';

    return (
      <div className="header-block_wallet-limits-tab_status">
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
      <div className="header-block_wallet-limits-tab_status">
        {limit.type} - <span className="header-block_wallet-limits-tab_status_is-locked">Locked</span>
      </div>
      {
        limit.authorUUID &&
        <div className="header-block_wallet-limits-tab_log">
          by <Uuid uuid={limit.authorUUID} />
        </div>
      }
      <div className="header-block_wallet-limits-tab_log">Reason - {limit.reason}</div>
      {
        limit.startLock && moment(limit.startLock).isValid() &&
        <div className="header-block_wallet-limits-tab_log">
          on {moment(limit.startLock).format('DD.MM.YYYY HH:mm')}
        </div>
      }
    </div>
  );

  renderLoginUnlock = () => (
    <div className="limits-info_tab">
      <div className="header-block_wallet-limits-tab_status">
       Login - <span className="header-block_wallet-limits-tab_status_is-locked">Locked</span>
      </div>
      <div className="header-block_wallet-limits-tab_log">
        by 5 failed login attempts
      </div>
      <div className="header-block_wallet-limits-tab_log">
        until 24.04.2017 13:00
      </div>
      <button type="button" className="btn btn-danger-outline limits-info_tab-button" onClick={() => {}}>
        Unlock login
      </button>
    </div>
  );

  render() {
    const { dropDownOpen, modal } = this.state;
    const { limits: { entities, deposit, withdraw }, profile } = this.props;
    const className = classNames('dropdown-highlight cursor-pointer', {
      'dropdown-open': dropDownOpen,
    });

    return (
      <div className={className}>
        <Dropdown className="dropdown-inline" isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
          <div className="header-block_wallet-limits-tab">
            <div className="header-block-title">Locks</div>
            {this.renderStatus('Deposit', deposit.locked)}
            {this.renderStatus('Withdrawal', withdraw.locked)}
            <div className="header-block_wallet-limits-tab_status">
              Login - <span className="header-block_wallet-limits-tab_status_is-locked">Locked</span>
            </div>
          </div>

          <DropdownMenu>
            <div className="header-block_wallet-limits_btn-group">
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
                {this.renderLoginUnlock()}
              </div>
            }
          </DropdownMenu>
        </Dropdown>

        {
          modal.show &&
          <WalletLimitsModal
            {...modal.params}
            onSubmit={this.handleSubmit}
            onHide={this.handleModalHide}
            profile={profile}
          />
        }
      </div>
    );
  }
}

export default WalletLimits;
