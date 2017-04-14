import React, { Component } from 'react';
import { Dropdown, DropdownMenu } from 'reactstrap';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from '../../../../constants/propTypes';
import { shortify } from '../../../../utils/uuid';
import './WalletLimits.scss';

class WalletLimits extends Component {
  static propTypes = {
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
  };

  state = {
    dropDownOpen: false,
  };

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
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

  renderButton = (label, canUnlock, className) => {
    return (
      <button type="button" className={className}>
        {canUnlock ? 'Unlock' : 'Lock'} {label}
      </button>
    );
  };

  renderLimit = limit => (
    <div key={limit.id} className="limits-info_tab">
      <div className="header-block_wallet-limits-tab_status">
        {limit.type} - <span className="header-block_wallet-limits-tab_status_is-locked">Locked</span>
      </div>
      {
        limit.authorUuid &&
        <div className="header-block_wallet-limits-tab_log">
          by {shortify(limit.authorUuid)}
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

  render() {
    const { dropDownOpen } = this.state;
    const { limits: { entities, deposit, withdraw } } = this.props;
    const className = classNames('balances-block dropdown-highlight', {
      'dropdown-open': dropDownOpen,
    });

    return (
      <div className={className}>
        <Dropdown className="dropdown-inline" isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
          <div className="header-block_wallet-limits-tab">
            <span className="header-block-title">Locks</span>
            {this.renderStatus('Deposit', deposit.locked)}
            {this.renderStatus('Withdrawal', withdraw.locked)}
          </div>

          <DropdownMenu>
            <div className="header-block_wallet-limits_btn-group">
              {this.renderButton('deposit', deposit.canUnlock, 'btn btn-danger-outline margin-right-10')}
              {this.renderButton('withdrawal', withdraw.canUnlock, 'btn btn-danger-outline')}
            </div>
            {
              entities.length > 0 &&
              <div className="limits-info">
                {entities.map(this.renderLimit)}
              </div>
            }
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default WalletLimits;
