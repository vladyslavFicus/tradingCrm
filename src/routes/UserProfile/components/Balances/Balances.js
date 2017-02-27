import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import Amount from 'components/Amount';

class Balances extends Component {
  state = {
    dropDownOpen: false,
  };

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen
    });
  };

  render() {
    const { dropDownOpen } = this.state;
    const { label, accumulatedBalances: { data } } = this.props;

    return (
      !data
        ? label
        : this.renderDropDown(label, data, dropDownOpen)
    );
  }

  renderDropDown = (label, data, dropDownOpen) => {
    return (
      <div>
        <Dropdown className='dropdown-inline' isOpen={dropDownOpen} toggle={this.toggle}>
          <span onClick={this.toggle}>{label}</span>
            <DropdownMenu>
              <DropdownItem>
                <span className="amount"> <Amount { ...data.deposits } /> </span> <br />
                <span className="text-uppercase">Deposit</span>
              </DropdownItem>
              <DropdownItem>
                <span className="amount"> <Amount { ...data.withdraws } /> </span> <br />
                <span className="text-uppercase">Withdraws</span>
              </DropdownItem>
            </DropdownMenu>
        </Dropdown>
      </div>
    );
  }

}

Balances.propTypes = {
  label: PropTypes.any.isRequired,
  accumulatedBalances: PropTypes.shape({
    data: PropTypes.object
  }),
};

export default Balances;
