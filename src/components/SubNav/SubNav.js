import React, { Component } from 'react';
import SubNavItem from '../SubNavItem';
import PropTypes from '../../constants/propTypes';

class SubNav extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.navSubItem).isRequired,
    onMenuItemClick: PropTypes.func.isRequired,
  };

  render() {
    const { items, onMenuItemClick } = this.props;

    return (
      <div className="dropdown-menu">
        {items.map(item => (
          <SubNavItem
            key={item.label}
            label={item.label}
            url={item.url}
            onMenuItemClick={onMenuItemClick}
          />
        ))}
      </div>
    );
  }
}

export default SubNav;
