import React, { Component } from 'react';
import PropTypes from '../../constants/propTypes';
import NavItem from '../NavItem';

class Nav extends Component {
  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    onMenuItemClick: PropTypes.func.isRequired,
    onToggleTab: PropTypes.func.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    className: 'nav',
  };

  render() {
    const {
      items,
      className,
      onToggleTab,
      onMenuItemClick,
      isSidebarOpen,
    } = this.props;

    return (
      <ul className={className}>
        {items.map((item, index) => (
          <NavItem
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
