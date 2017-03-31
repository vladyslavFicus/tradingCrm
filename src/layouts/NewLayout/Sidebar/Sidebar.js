import React, { Component } from 'react';
import Nav from '../Nav';
import PropTypes from '../../../constants/propTypes';

class Sidebar extends Component {
  static propTypes = {
    topMenu: PropTypes.arrayOf(PropTypes.menuItem).isRequired,
    bottomMenu: PropTypes.arrayOf(PropTypes.menuItem).isRequired,
  };

  render() {
    return (
      <aside className="sidebar">
        <Nav items={sidebarTopMenuItems} />
        <SidebarMenu className="navbar-nav support-tab" items={sidebarBottomMenuItems} />
      </aside>
    );
  }
}

export default Sidebar;
