import React, { Component } from 'react';
import { Dropdown, DropdownMenu } from 'reactstrap';
import classNames from 'classnames';
import PropTypes from '../../../../constants/propTypes';
import './WalletLimits.scss';

class WalletLimits extends Component {
  static propTypes = {
    label: PropTypes.any.isRequired,
  };

  state = {
    dropDownOpen: false,
  };

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
  };

  renderDropDown = (label, dropDownOpen) => (
    <Dropdown className="dropdown-inline" isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
      {label}

      <DropdownMenu>
        <div className="header-block_wallet-limits_btn-group">
            <button type="button" className="btn btn-danger-outline margin-right-10">Unlock deposit</button>
            <button type="button" className="btn btn-danger-outline">Lock withdrawal</button>
        </div>
        <div className="limits-info">
          <div className="limits-info_tab">
            <div className="header-block_wallet-limits-tab_status">
              Deposit - <span className="header-block_wallet-limits-tab_status_is-locked">Locked</span>
            </div>
            <div className="header-block_wallet-limits-tab_log">by OP-675p567</div>
            <div className="header-block_wallet-limits-tab_log">Reason - Reason3</div>
            <div className="header-block_wallet-limits-tab_log">on 14.10.2016 13:00</div>
          </div>
          <div className="limits-info_tab">
            <div className="header-block_wallet-limits-tab_status">
              Deposit - <span className="header-block_wallet-limits-tab_status_is-locked">Locked</span>
            </div>
            <div className="header-block_wallet-limits-tab_log">Reason: Profile incomplete</div>
          </div>
          <div className="limits-info_tab">
            <div className="header-block_wallet-limits-tab_status">
              Withdrawal - <span className="header-block_wallet-limits-tab_status_is-locked">Locked</span>
            </div>
            <div className="header-block_wallet-limits-tab_log">by OP-675p567</div>
            <div className="header-block_wallet-limits-tab_log">Reason - Reason4</div>
            <div className="header-block_wallet-limits-tab_log">on 14.10.2016 13:00</div>
          </div>
          <div className="limits-info_tab">
            <div className="header-block_wallet-limits-tab_status">
              Withdrawal - <span className="header-block_wallet-limits-tab_status_is-locked">Locked</span>
            </div>
            <div className="header-block_wallet-limits-tab_log">Reason - KYC not verified</div>
          </div>
          <div className="limits-info_tab">
            <div className="header-block_wallet-limits-tab_status">
              Withdrawal - <span className="header-block_wallet-limits-tab_status_is-locked">Locked</span>
            </div>
            <div className="header-block_wallet-limits-tab_log">by BM-675p567</div>
            <div className="header-block_wallet-limits-tab_log">until 14.10.2016 13:00</div>
          </div>
        </div>
      </DropdownMenu>
    </Dropdown>
  );

  render() {
    const { dropDownOpen } = this.state;
    const { label } = this.props;
    const dropdownClassName = classNames('balances-block dropdown-highlight', {
      'dropdown-open': dropDownOpen,
    });

    return (
      <div className={dropdownClassName}>
        {
          this.renderDropDown(label, dropDownOpen)
        }
      </div>
    );
  }
}

export default WalletLimits;
