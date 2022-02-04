import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import compose from 'compose-function';
import classNames from 'classnames';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
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
    className: PropTypes.string,
    permission: PropTypes.permission.isRequired,
  };

  static defaultProps ={
    className: '',
  }

  render() {
    const {
      items,
      match: {
        params: {
          id,
        },
      },
      location: { pathname },
      className,
      permission: { permissions },
    } = this.props;

    const tabs = items.filter(item => (
      !item.permissions || item.permissions.check(permissions)
    ));

    return (
      <div className={classNames('Tabs', className)}>
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
