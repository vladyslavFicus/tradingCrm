import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import Amount from '../../../../components/Amount';
import './Balances.scss';

class Balances extends Component {
  static propTypes = {
    label: PropTypes.any.isRequired,
    accumulatedBalances: PropTypes.shape({
      data: PropTypes.object,
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

  render() {
    const { dropDownOpen } = this.state;
    const { label, accumulatedBalances: { data } } = this.props;
    const dropdownClassName = classNames('balances-block dropdown-highlight', {
      'dropdown-open': dropDownOpen,
    });

    return (
      <div className={dropdownClassName}>
        {!data
          ? label
          : this.renderDropDown(label, data, dropDownOpen)
        }
      </div>
    );
  }

  renderDropDown = (label, data, dropDownOpen) => (
    <Dropdown className="dropdown-inline" isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
      {label}

      <DropdownMenu>
        <DropdownItem>
          <div className="amount"><Amount {...data.deposits} /></div>
          <div className="text-uppercase font-size-11">Deposit</div>
        </DropdownItem>
        <DropdownItem>
          <div className="amount"><Amount {...data.withdraws} /></div>
          <div className="text-uppercase font-size-11">Withdraws</div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default Balances;
