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

  render() {
    const { dropDownOpen } = this.state;
    const { limits, onChange } = this.props;
    const className = classNames('balances-block dropdown-highlight', {
      'dropdown-open': dropDownOpen,
    });

    return (
      <div className={className}>
        <Dropdown className="dropdown-inline" isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
          <div className="header-block_wallet-limits-tab">
            <span className="header-block-title">Locks</span>
            <div className="header-block_wallet-limits-tab_status">
              Deposit - <span className="header-block_wallet-limits-tab_status_is-locked">Locked</span>
            </div>
            <div className="header-block_wallet-limits-tab_status">
              Withdrawal - <span className="header-block_wallet-limits-tab_status_is-allowed">Allowed</span>
            </div>
          </div>

          <DropdownMenu>
            <div className="header-block_wallet-limits_btn-group">
              <button type="button" className="btn btn-danger-outline margin-right-10">Unlock deposit</button>
              <button type="button" className="btn btn-danger-outline">Lock withdrawal</button>
            </div>
            <div className="limits-info">
              {limits.entities.map((limit) => {
                return (
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
              })}
            </div>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default WalletLimits;
