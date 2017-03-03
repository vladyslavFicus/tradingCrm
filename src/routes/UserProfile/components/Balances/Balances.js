import React, { Component, PropTypes } from 'react';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import Amount from 'components/Amount';
import classNames from 'classnames';
import './Balances.scss'

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
      <div className={classNames('player__account__balance width-20 cursor-pointer padding-0', {
        'dropdown-open': dropDownOpen,
      })}>{
                   !data
                     ? label
                     : this.renderDropDown(label, data, dropDownOpen)

                 }
      </div>

    );
  }

  renderDropDown = (label, data, dropDownOpen) => {
    return (
      <Dropdown className='dropdown-inline' isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
        {label}
        <DropdownMenu>
          <DropdownItem>
            <span className="amount"> <Amount { ...data.deposits } /> </span> <br />
            <span className="text-uppercase font-size-11">Deposit</span>
          </DropdownItem>
          <DropdownItem>
            <span className="amount"> <Amount { ...data.withdraws } /> </span> <br />
            <span className="text-uppercase font-size-11">Withdraws</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

}

Balances.propTypes = {
  label: PropTypes.any.isRequired,
    profileStatus: PropTypes.string,
  accumulatedBalances: PropTypes.shape({
    data: PropTypes.object
  }),
};

export default Balances;
