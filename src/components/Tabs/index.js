import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

const Tabs = ({ location, items, params }) => <ul className="nav nav-tabs">
  {items.map((item, key) => <li key={key} className={classNames('nav-item')}>
    <Link
      activeClassName={'active'}
      className={'nav-link'}
      to={item.url.replace(/:id/, params.id)}
    >{item.label}</Link>
    <div className="badge">3</div>
  </li>)}
</ul>;

Tabs.propTypes = {
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
  }).isRequired,
  items: React.PropTypes.arrayOf(React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
  })),
};

export default Tabs;
