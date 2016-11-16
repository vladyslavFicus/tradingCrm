import React, { Component, PropTypes } from 'react';
import DropDownWrapper from 'components/Bootstrap/DropDownWrapper';
import { DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router';

class TopMenu extends Component {
  render() {
    return <nav className="top-menu">
      <div className="menu-icon-container hidden-md-up">
        <div className="animate-menu-button left-menu-toggle">
          <div/>
        </div>
      </div>
      <div className="menu">
        <div className="menu-user-block">
          <DropDownWrapper className="dropdown-avatar">
            <DropdownToggle caret tag="a">
              <i className="fa fa-user-secret fa-3x"/>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-right">
              <DropdownItem>
                <Link to={`/users/${this.context.user.uuid}/profile`}>Profile</Link>
              </DropdownItem>
              <DropdownItem>
                <Link to={'/logout'}>Logout</Link>
              </DropdownItem>
            </DropdownMenu>
          </DropDownWrapper>
        </div>
      </div>
    </nav>;
  }
}

TopMenu.contextTypes = {
  user: PropTypes.shape({
    token: PropTypes.string,
    uuid: PropTypes.string,
  }).isRequired,
};

export default TopMenu;
