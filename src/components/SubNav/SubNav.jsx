import React, { Component } from 'react';
import SubNavItem from '../SubNavItem';
import PropTypes from '../../constants/propTypes';
import './SubNav.scss';

class SubNav extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.navSubItem).isRequired,
  };

  render() {
    const { items } = this.props;

    return (
      <div className="sub-nav">
        {items.map(item => (
          <SubNavItem
            key={item.label}
            label={item.label}
            url={item.url}
          />
        ))}
      </div>
    );
  }
}

export default SubNav;
