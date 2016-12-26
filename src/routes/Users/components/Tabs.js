import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

const tabItems = {
  profile: { label: 'Profile', route: '/users/:id/profile' },
  transactions: { label: 'Transactions', route: '/users/:id/payments' },
  gameActivity: { label: 'Game activity', route: '/users/:id/game-activity' },
  bonuses: { label: 'Bonuses', route: '/users/:id/bonuses' },
  limits: { label: 'Limits', route: '/users/:id/limits' },
};

const Tabs = ({ activeTabName }) => (props) => <ul className="nav nav-tabs" role="tablist">
  {Object.keys(tabItems).map((name) => {
    const item = tabItems[name];

    return <li
      key={name}
      className={classNames('nav-item')}>
      <Link
        className={classNames(['nav-link', { active: activeTabName === name }])}
        to={item.route.replace(/:id/, props.params.id)}
      >
        {item.label}
      </Link>
    </li>;
  })}
</ul>;

export default Tabs;
