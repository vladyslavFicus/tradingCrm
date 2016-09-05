import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

const menuItems = [
  { label: 'Users', url: '/users', icon: 'fa fa-users' },
  { label: 'Transactions', url: '/transactions', icon: 'fa fa-credit-card' },
  { label: 'Bonus campaigns', url: '/bonus-campaigns', icon: 'fa fa-gift' },
];

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuItems,
    };
  }

  render() {
    const { location } = this.props;
    const { menuItems } = this.state;
    return <nav className="left-menu">
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
    </nav>;
  }
}

export default Sidebar;
