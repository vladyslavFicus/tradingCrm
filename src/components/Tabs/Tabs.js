import React, { PureComponent } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'react-apollo';
import classNames from 'classnames';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { withPermission } from 'providers/PermissionsProvider';
import './Tabs.scss';

class Tabs extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    items: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string,
    })).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
    permission: PropTypes.permission.isRequired,
  };

  render() {
    const {
      items,
      match: {
        params: {
          id,
        },
      },
      location: { pathname },
      permission: { permissions },
    } = this.props;

    const tabs = items.filter(item => (
      !item.permissions || item.permissions.check(permissions)
    ));

    return (
      <div className="Tabs">
        {
          tabs.map((tab, key) => {
            const url = tab.url.replace(/:id/, id);

            return (
              <Link
                key={key}
                className={
                  classNames('Tabs__item', {
                    'Tabs__item--active': pathname.indexOf(url) === 0,
                  })
                }
                to={url}
              >
                {I18n.t(tab.label)}
              </Link>
            );
          })
        }
      </div>
    );
  }
}

export default compose(
  withPermission,
  withRouter,
)(Tabs);
