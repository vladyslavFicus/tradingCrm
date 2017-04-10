import React, { Component } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
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
        <button type="button" className="btn btn-danger-outline margin-right-10">Unlock deposit</button>
        <button type="button" className="btn btn-danger-outline">Lock Withdrawal</button>
        <div className="text-uppercase font-size-11">Withdraws</div>
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
