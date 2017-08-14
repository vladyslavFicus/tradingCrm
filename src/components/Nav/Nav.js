import React, { Component } from 'react';
import PropTypes from '../../constants/propTypes';
import NavItem from '../NavItem';

class Nav extends Component {
  static propTypes = {
    className: PropTypes.string,
    isHover: PropTypes.bool.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
    items: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    onMenuClick: PropTypes.func.isRequired,
    onOpenTab: PropTypes.func.isRequired,
  };
  static defaultProps = {
    className: 'nav',
  };

  render() {
    const {
      items,
      className,
      onOpenTab,
      onMenuClick,
    } = this.props;

    return (
      <ul className={className}>
        {items.map((item, index) => (
          <NavItem
            key={index}
            index={index}
            label={item.label}
            isOpen={item.isOpen}
            icon={item.icon}
            url={item.url}
            items={item.items}
            onToggleMenuItem={onOpenTab}
            onMenuClick={onMenuClick}
          />
        ))}
      </ul>
    );
  }
}


export default Nav;
