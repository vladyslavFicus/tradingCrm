import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

const Tabs = ({ items, params }) => (
  <ul className="nav nav-tabs">
    {items.map(item => (
      <li key={item.url} className={classNames('nav-item')}>
        <Link
          activeClassName={'active'}
          className={'nav-link'}
          to={item.url.replace(/:id/, params.id)}
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
);

Tabs.propTypes = {
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
  }).isRequired,
  items: React.PropTypes.arrayOf(React.PropTypes.shape({
    label: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
  })),
};
Tabs.defaultProps = {
  items: [],
};

export default Tabs;
