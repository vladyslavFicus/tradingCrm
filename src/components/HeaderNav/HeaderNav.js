import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './HeaderNav.scss';

class HeaderNav extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      id: PropTypes.string,
    })).isRequired,
  };

  state = {
    active: false,
  };

  handleToggleState = () => {
    this.setState(({ active }) => ({ active: !active }));
  };

  render() {
    const { items } = this.props;
    const { active } = this.state;

    return (
      <Dropdown
        className="header-nav"
        isOpen={active}
        toggle={this.handleToggleState}
      >
        <DropdownToggle
          className="header-nav__toggle"
          tag="button"
          id="profile-logout-toggle"
        >
          <i className="fa fa-user" />
        </DropdownToggle>
        <DropdownMenu right>
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

export default HeaderNav;
