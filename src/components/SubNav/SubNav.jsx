import React, { Component } from 'react';
import SubNavItem from '../SubNavItem';
import PropTypes from '../../constants/propTypes';
import './SubNav.scss';

class SubNav extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.navSubItem).isRequired,
    onMenuItemClick: PropTypes.func.isRequired,
  };

  render() {
    const { items, onMenuItemClick } = this.props;

    return (
      <div className="sub-nav">
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
