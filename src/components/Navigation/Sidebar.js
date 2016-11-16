import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

const Sidebar = ({ location, menuItems }) => (
  <nav className="left-menu">
    <div className="logo-container">
      <Link to={'/'} className="logo" style={{ fontSize: 32 + 'px' }}>
        <span style={{ color: '#fff' }}>NEW</span>
        <span style={{ color: 'rgb(26, 122, 175)' }}>AGE</span>
      </Link>
    </div>
    <div className="left-menu-inner scroll-pane">
      <ul className="left-menu-list left-menu-list-root list-unstyled">
        {menuItems.map((item) => (
          <li key={item.url}
              className={classNames({ 'left-menu-list-active': location.pathname.indexOf(item.url) === 0 })}>
            <Link className="left-menu-link" to={item.url}>
              {item.icon && <i className={classNames('left-menu-link-icon', item.icon)}/>}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </nav>
);

Sidebar.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  menuItems: PropTypes.array.isRequired,
};

export default Sidebar;
