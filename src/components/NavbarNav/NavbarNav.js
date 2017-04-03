import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from '../../constants/propTypes';

class NavbarNav extends Component {
  static propTypes = {
    label: PropTypes.any.isRequired,
    items: PropTypes.arrayOf(PropTypes.navbarNavItem).isRequired,
  };

  state = {
    active: false,
  };

  handleToggleState = () => {
    this.setState({ active: !this.state.active });
  };

  render() {
    const {active} = this.state;

    return (
      <Dropdown isOpen={active} toggle={this.handleToggleState}>
        <DropdownToggle className="dropdown-btn">
          <i className="fa fa-user" />
        </DropdownToggle>
        <DropdownMenu>
            <DropdownItem>
              Log-out
            </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default NavbarNav;
