import React, { Component } from 'react';
import PropTypes from '../../constants/propTypes';
import NavItem from '../NavItem';

class Nav extends Component {
  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.navItem).isRequired,
  };
  static defaultProps = {
    className: 'nav',
  };

  render() {
    const {
      items,
      className,
      handleOpenTap,
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
          />
        ))}
      </ul>
    );
  }
}


export default Nav;
