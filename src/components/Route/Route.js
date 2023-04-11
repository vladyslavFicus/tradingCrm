import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route as OriginalRoute, Redirect, withRouter } from 'react-router-dom';
import { routesPermissions } from 'config/routes';
import { withStorage } from 'providers/StorageProvider';
import { PermissionConsumer } from 'providers/PermissionsProvider';
import Forbidden from 'routes/Forbidden';

class Route extends PureComponent {
  static propTypes = {
    layout: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    disableScroll: PropTypes.bool,
    location: PropTypes.object.isRequired,
    computedMatch: PropTypes.object.isRequired,
    isPublic: PropTypes.bool,
    isPrivate: PropTypes.bool,
    token: PropTypes.string,
    path: PropTypes.string.isRequired,
    auth: PropTypes.object,
  };

  static defaultProps = {
    layout: ({ children }) => children, // Default layout for routes. Just render children.
    disableScroll: false,
    isPublic: false,
    isPrivate: false,
    token: null,
    auth: null,
  };

  componentDidUpdate(prevProps) {
    const {
      disableScroll,
      location: { pathname },
      computedMatch: { isExact },
    } = this.props;

    if (!disableScroll && pathname !== prevProps.location.pathname && isExact) {
      window.scrollTo(0, 0);
    }
  }

  isRouteForbidden(permission) {
    const {
      path,
      auth,
      token,
    } = this.props;

    const routePermissions = routesPermissions[path];

    return routePermissions && routePermissions.length && auth && token && !permission.allowsAll(routePermissions);
  }

  render() {
    const {
      layout: Layout,
      isPublic,
      isPrivate,
      token,
      auth,
      ...props
    } = this.props;

    if (isPublic && token && auth) {
      return <Redirect to="/dashboard" />;
    }

    if (isPrivate && (!token || !auth)) {
      return <Redirect to="/" />;
    }

    return (
      <Layout>
        <PermissionConsumer>
          {({ permission } = {}) => (
            <Choose>
              <When condition={permission && this.isRouteForbidden(permission)}>
                <Forbidden />
              </When>
              <Otherwise>
                <OriginalRoute {...props} />
              </Otherwise>
            </Choose>
          )}
        </PermissionConsumer>
      </Layout>
    );
  }
}

export default withRouter(withStorage(['token', 'auth'])(Route));
