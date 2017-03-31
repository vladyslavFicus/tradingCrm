import React, { Component } from 'react';
import PropTypes from '../../constants/propTypes';
import NavItem from './NavItem';

class Nav extends Component {
  static propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.navItem).isRequired,
  };
  static defaultProps = {
    className: 'navbar-nav',
  };

  render() {
    const {
      items,
      className,
    } = this.props;

    return (
      <ul className={className}>
        {items.map(item => (
          <NavItem
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


export default Nav;
