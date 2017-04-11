import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import Amount from '../../../../components/Amount';
import PropTypes from '../../../../constants/propTypes';

class Balances extends Component {
  static propTypes = {
    label: PropTypes.any.isRequired,
    accumulatedBalances: PropTypes.shape({
      deposits: PropTypes.price,
      withdraws: PropTypes.price,
      total: PropTypes.price,
      bonus: PropTypes.price,
      real: PropTypes.price,
    }),
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
        <DropdownItem>
          <div className="amount"><Amount {...balances.deposits} /></div>
          <div className="amount_label">Deposited</div>
        </DropdownItem>
        <DropdownItem>
          <div className="amount"><Amount {...balances.withdraws} /></div>
          <div className="amount_label">Withdrawn</div>
        </DropdownItem>
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
