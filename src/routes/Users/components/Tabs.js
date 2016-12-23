import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

const Tabs = (props) => <ul className="nav nav-tabs" role="tablist">
  {Object.keys(tabItems).map((name) => {
    const item = tabItems[name];

    return <li
      key={name}
      className={classNames('nav-item')}>
      <Link
        className={classNames(['nav-link', { active: location.pathname.indexOf(item.route) > -1 }])}
        to={item.route.replace(/:id/, props.params.id)}
      >
        {item.label}
      </Link>
    </li>;
  })}
</ul>;

export default Tabs;
