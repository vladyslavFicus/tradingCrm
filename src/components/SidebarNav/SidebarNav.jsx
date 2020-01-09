import React, { Component } from 'react';
import PropTypes from '../../constants/propTypes';
import SidebarNavItem from '../SidebarNavItem';

class Nav extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
  };

  render() {
    const {
      items,
      isSidebarOpen,
    } = this.props;

    return (
      <ul className="nav flex-column">
        {items.map((item, index) => (
          <SidebarNavItem
            {...item}
            isSidebarOpen={isSidebarOpen}
            key={item.label}
            index={index}
          />
        ))}
      </ul>
    );
  }
}


export default Nav;
