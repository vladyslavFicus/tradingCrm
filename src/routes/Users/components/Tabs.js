import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

const tabItems = {
  profile: { label: 'Profile', route: '/users/:id/profile' },
  transactions: { label: 'Transactions', route: '/users/:id/transactions' }, /*
   'balance': { label: 'Deposit/withdraw', component: Tabs.Balance },*/
};

const Tabs = ({ activeTabName }) => (props) => <ul className="nav nav-tabs" role="tablist">
  {Object.keys(tabItems).map((name) => {
    const item = tabItems[name];

    return <li
      key={name}
      className={classNames('nav-item', { active: activeTabName === name })}>
      {activeTabName === name ? <a className="nav-link active" href="javascript:void(0)">{item.label}</a> : <Link to={item.route.replace(/:id/, props.params.id)}>{item.label}</Link>}
    </li>;
  })}
</ul>;

export default Tabs;
