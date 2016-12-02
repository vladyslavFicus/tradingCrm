import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import SidebarItem from './SidebarItem';

class Sidebar extends Component {
  render() {
    const { location, menuItems } = this.props;
    return <nav className="left-menu">
      <div className="logo-container">
        <Link to={'/'} className="logo" style={{ fontSize: 32 + 'px' }}>
          <span style={{ color: '#fff' }}>NEW</span>
          <span style={{ color: 'rgb(26, 122, 175)' }}>AGE</span>
        </Link>
      </div>
      <div className="left-menu-inner scroll-pane">
        <ul className="left-menu-list left-menu-list-root list-unstyled">
          {menuItems.map((item, key) => <SidebarItem key={key} location={location} {...item}/>)}
        </ul>
      </div>
    </nav>;
  }
}

Sidebar.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  menuItems: PropTypes.array.isRequired,
};

export default Sidebar;
