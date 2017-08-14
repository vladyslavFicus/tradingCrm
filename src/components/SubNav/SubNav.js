import React, { Component } from 'react';
import SubNavItem from '../SubNavItem';
import PropTypes from '../../constants/propTypes';

class SubNav extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.navSubItem).isRequired,
    onMenuClick: PropTypes.func.isRequired,
  };

  render() {
    const { items, onMenuClick } = this.props;

    return (
      <div className='dropdown-menu'>
        {items.map((item, index) => (
          <SubNavItem
            key={index}
            label={item.label}
            url={item.url}
            onMenuClick={onMenuClick}
          />
        ))}
      </div>
    );
  }
}

export default SubNav;
