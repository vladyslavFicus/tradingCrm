import React, { Component } from 'react';
import PropTypes from '../../constants/propTypes';
import SidebarNavItem from '../SidebarNavItem';

class Nav extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    onMenuItemClick: PropTypes.func.isRequired,
    onToggleTab: PropTypes.func.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
  };

  render() {
    const {
      items,
      onToggleTab,
      onMenuItemClick,
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
            onToggleTab={onToggleTab}
            onMenuItemClick={onMenuItemClick}
          />
        ))}
      </ul>
    );
  }
}


export default Nav;
