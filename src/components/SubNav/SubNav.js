import React, { Component } from 'react';
import SubNavItem from '../SubNavItem';
import PropTypes from '../../constants/propTypes';

class SubNav extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.navSubItem).isRequired,
  };

  render() {
    const { items } = this.props;

    return (
      <div className="dropdown-menu">
        {items.map((item, index) => (
          <SubNavItem
            key={index}
            label={item.label}
            url={item.url}
          />
        ))}
      </div>
    );
  }
}

export default SubNav;
