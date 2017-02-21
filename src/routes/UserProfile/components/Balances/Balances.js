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
        <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
          <span onClick={this.toggle}>{label}</span>
            <DropdownMenu>
              <DropdownItem>
                Deposit - <Amount { ...data.deposits } />
              </DropdownItem>
              <DropdownItem>
                Withdraws - <Amount { ...data.withdraws } />
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
