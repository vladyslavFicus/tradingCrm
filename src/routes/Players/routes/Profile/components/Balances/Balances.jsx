import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import Amount from '../../../../../../components/Amount';
import PropTypes from '../../../../../../constants/propTypes';

class Balances extends Component {
  static propTypes = {
    label: PropTypes.any.isRequired,
    accumulatedBalances: PropTypes.shape({
      walletCurrencyDeposits: PropTypes.price,
      withdrawableAmount: PropTypes.price,
      walletCurrencyWithdraws: PropTypes.price,
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

  renderDropDown = (label, { walletCurrencyWithdraws, walletCurrencyDeposits, withdrawableAmount }, dropDownOpen) => (
    <Dropdown isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
      <DropdownToggle
        tag="div"
        onClick={this.toggle}
        data-toggle="dropdown"
        aria-expanded={dropDownOpen}
      >
        {label}
      </DropdownToggle>
      <DropdownMenu>
        <div className="dropdown-menu__content">
          <DropdownItem>
            <Amount
              className="amount"
              amountId="player-balance-withdrawable-amount"
              {...withdrawableAmount}
            />
            <div className="amount_label" id="player-balance-withdrawable-amount-label">
              {I18n.t('PLAYER_PROFILE.PROFILE.BALANCES_DROPDOWN.WITHDRAWABLE')}
            </div>
          </DropdownItem>
          <DropdownItem>
            <Amount
              className="amount"
              amountId="player-balance-deposited-amount"
              {...walletCurrencyDeposits}
            />
            <div className="amount_label" id="player-balance-deposited-amount-label">
              {I18n.t('PLAYER_PROFILE.PROFILE.BALANCES_DROPDOWN.DEPOSITED')}
            </div>
          </DropdownItem>
          <DropdownItem>
            <Amount
              className="amount"
              amountId="player-balance-withdrawn-amount"
              {...walletCurrencyWithdraws}
            />
            <div className="amount_label" id="player-balance-withdrawn-amount-label">
              {I18n.t('PLAYER_PROFILE.PROFILE.BALANCES_DROPDOWN.WITHDRAWN')}
            </div>
          </DropdownItem>
        </div>
      </DropdownMenu>
    </Dropdown>
  );

  render() {
    const { dropDownOpen } = this.state;
    const { label, accumulatedBalances: balances } = this.props;
    const dropdownClassName = classNames('dropdown-highlight cursor-pointer', {
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
