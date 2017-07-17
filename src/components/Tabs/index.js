import React from 'react';
import { Link } from 'react-router';

const Tabs = ({ items, params, location: { pathname } }) => (
  <ul className="nav nav-tabs">
    {items.map((item) => {
      const url = item.url.replace(/:id/, params.id);

      return (
        <li key={url} className="nav-item">
          {
            pathname.indexOf(url) === -1
              ? <Link className="nav-link" to={item.url.replace(/:id/, params.id)}>{item.label}</Link>
              : <span className="nav-link active">{item.label}</span>
          }
        </li>
      );
    })}
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
