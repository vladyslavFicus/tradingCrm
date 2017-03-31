import React, { Component } from 'react';
import Nav from '../Nav';
import PropTypes from '../../../constants/propTypes';

class Sidebar extends Component {
  static propTypes = {
    topMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    bottomMenu: PropTypes.arrayOf(PropTypes.navItem).isRequired,
  };

  render() {
    return (
      <aside className="sidebar">
        <Nav items={this.props.topMenu} />
        <Nav className="navbar-nav support-tab" items={this.props.bottomMenu} />
      </aside>
    );
  }
}

export default Sidebar;
