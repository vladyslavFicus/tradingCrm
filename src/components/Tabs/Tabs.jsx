import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Tabs.scss';

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
      <ul className="tabs">
        {items.map((item) => {
          const url = item.url.replace(/:id/, params.id);

          return (
            <li key={url}>
              <Choose>
                <When condition={pathname.indexOf(url) === -1}>
                  <Link className="tabs__item" to={url}>
                    {item.label}
                  </Link>
                </When>
                <Otherwise>
                  <span className="tabs__item active">
                    {item.label}
                  </span>
                </Otherwise>
              </Choose>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default Tabs;
