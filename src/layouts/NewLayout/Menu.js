import React, { Component, PropTypes } from 'react';
import MenuItem from './MenuItem';

class Menu extends Component {
  static propTypes = {className: PropTypes.string};
  static defaultProps = {className: 'navbar-nav'};
  render () {
    const {
      items,
      className,
    } = this.props;

    return (
      <ul className={className}>
        {items.map(item => (
          <MenuItem
            label={item.label}
            icon={item.icon}
            url={item.url}
            items={item.items}
          />
        ))}
      </ul>
    );
  }
}


export default Menu;
