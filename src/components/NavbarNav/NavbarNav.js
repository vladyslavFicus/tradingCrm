import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from '../../constants/propTypes';

class NavbarNav extends Component {
  static propTypes = {
    label: PropTypes.any.isRequired,
    items: PropTypes.arrayOf(PropTypes.navbarNavItem).isRequired,
    dropdownToggleId: PropTypes.string,
  };
  static defaultProps = {
    dropdownToggleId: '',
  };

  state = {
    active: false,
  };

  handleToggleState = () => {
    this.setState({ active: !this.state.active });
  };

  render() {
    const { active } = this.state;
    const { label, items, dropdownToggleId } = this.props;

    return (
      <Dropdown isOpen={active} toggle={this.handleToggleState}>
        <DropdownToggle className="dropdown-btn" id={dropdownToggleId}>
          {label}
        </DropdownToggle>
        <DropdownMenu>
          {items.map(item => (
            <DropdownItem key={item.label} onClick={item.onClick} id={item.id}>
              {item.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default NavbarNav;
