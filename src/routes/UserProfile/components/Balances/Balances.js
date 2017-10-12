import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import Amount from '../../../../components/Amount';
import PropTypes from '../../../../constants/propTypes';

class Balances extends Component {
  static propTypes = {
    label: PropTypes.any.isRequired,
    accumulatedBalances: PropTypes.shape({
      withdrawable: PropTypes.price,
      deposits: PropTypes.price,
      withdraws: PropTypes.price,
      total: PropTypes.price,
      bonus: PropTypes.price,
      real: PropTypes.price,
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

  renderDropDown = (label, balances, dropDownOpen) => (
    <Dropdown isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
      {label}
      <DropdownMenu>
        <div className="dropdown-menu__content">
          <DropdownItem>
            <Amount className="amount" {...balances.withdrawable} />
            <div className="amount_label">{I18n.t('PLAYER_PROFILE.PROFILE.BALANCES_DROPDOWN.WITHDRAWABLE')}</div>
          </DropdownItem>
          <DropdownItem>
            <Amount className="amount" {...balances.deposits} />
            <div className="amount_label">{I18n.t('PLAYER_PROFILE.PROFILE.BALANCES_DROPDOWN.DEPOSITED')}</div>
          </DropdownItem>
          <DropdownItem>
            <Amount className="amount" {...balances.withdraws} />
            <div className="amount_label">{I18n.t('PLAYER_PROFILE.PROFILE.BALANCES_DROPDOWN.WITHDRAWN')}</div>
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
