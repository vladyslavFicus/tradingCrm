import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import Amount from '../../../../../../components/Amount';
import PropTypes from '../../../../../../constants/propTypes';
import './Balances.scss';

class Balances extends Component {
  static propTypes = {
    label: PropTypes.any.isRequired,
    accumulatedBalances: PropTypes.shape({
      accumulatedDeposits: PropTypes.price.isRequired,
      accumulatedWithdrawals: PropTypes.price.isRequired,
      withdrawableAmount: PropTypes.price,
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

  renderDropDown = (label, { accumulatedDeposits, accumulatedWithdrawals, withdrawableAmount }, dropDownOpen) => (
    <Dropdown isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
      <DropdownToggle
        tag="div"
        onClick={this.toggle}
        data-toggle="dropdown"
        aria-expanded={dropDownOpen}
        className="cursor-pointer"
      >
        {label}
      </DropdownToggle>
      <DropdownMenu>
        <div className="form-row balances">
          <div className="col-auto balances__item">
            <Amount
              className="amount"
              amountId="player-balance-withdrawable-amount"
              {...withdrawableAmount}
            />
            <div className="amount_label" id="player-balance-withdrawable-amount-label">
              {I18n.t('PLAYER_PROFILE.PROFILE.BALANCES_DROPDOWN.WITHDRAWABLE')}
            </div>
          </div>
          <div className="col-auto balances__item">
            <Amount
              className="amount"
              amountId="player-balance-deposited-amount"
              {...accumulatedDeposits}
            />
            <div className="amount_label" id="player-balance-deposited-amount-label">
              {I18n.t('PLAYER_PROFILE.PROFILE.BALANCES_DROPDOWN.DEPOSITED')}
            </div>
          </div>
          <div className="col-auto balances__item">
            <Amount
              className="amount"
              amountId="player-balance-withdrawn-amount"
              {...accumulatedWithdrawals}
            />
            <div className="amount_label" id="player-balance-withdrawn-amount-label">
              {I18n.t('PLAYER_PROFILE.PROFILE.BALANCES_DROPDOWN.WITHDRAWN')}
            </div>
          </div>
        </div>
      </DropdownMenu>
    </Dropdown>
  );

  render() {
    const { dropDownOpen } = this.state;
    const { label, accumulatedBalances: balances } = this.props;
    const dropdownClassName = classNames('dropdown-highlight', {
      'dropdown-open': dropDownOpen,
    });

    return (
      <div className={dropdownClassName}>
        {!balances
          ? label
          : this.renderDropDown(label, balances, dropDownOpen)
        }
      </div>
    );
  }
}

export default Balances;
