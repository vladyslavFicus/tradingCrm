import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
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

  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    items: [],
    params: {},
  };

  filterItem = ({ permissions: perm }) => !perm || perm.check(this.context.permissions);

  render() {
    const {
      items,
      params,
      location: { pathname },
    } = this.props;

    return (
      <ul className="tabs">
        {items.filter(this.filterItem).map((item) => {
          const url = item.url.replace(/:id/, params.id);

          return (
            <li key={url}>
              <Choose>
                <When condition={pathname.indexOf(url) === -1}>
                  <Link className="tabs__item" to={url}>
                    {I18n.t(item.label)}
                  </Link>
                </When>
                <Otherwise>
                  <span className="tabs__item active">
                    {I18n.t(item.label)}
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
