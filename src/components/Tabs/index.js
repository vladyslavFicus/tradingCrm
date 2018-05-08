import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

class Tabs extends PureComponent {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })),
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  };
  static defaultProps = {
    items: [],
    params: {},
  };
  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  render() {
    const { items, params, location: { pathname } } = this.props;

    return (
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
  }
}

export default Tabs;
