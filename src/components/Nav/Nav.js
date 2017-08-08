import React, { Component } from 'react';
import PropTypes from '../../constants/propTypes';
import NavItem from '../NavItem';

class Nav extends Component {
  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.navItem).isRequired,
    onMenuClick: PropTypes.func.isRequired,
    handleOpenTap: PropTypes.func.isRequired,
  };
  static defaultProps = {
    className: 'nav',
  };

  render() {
    const {
      items,
      className,
      handleOpenTap,
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
            onToggleMenuItem={handleOpenTap}
            onMenuClick={onMenuClick}
          />
        ))}
      </ul>
    );
  }
}


export default Nav;
