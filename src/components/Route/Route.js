import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route as OriginalRoute, Redirect, withRouter } from 'react-router-dom';
import { routePermissions } from 'config/routes';
import { withStorage } from 'providers/StorageProvider';
import { PermissionConsumer } from 'providers/PermissionsProvider';
import Forbidden from 'routes/Forbidden';

class Route extends PureComponent {
  static propTypes = {
    layout: PropTypes.func,
    disableScroll: PropTypes.bool,
    location: PropTypes.object.isRequired,
    isPublic: PropTypes.bool,
    isPrivate: PropTypes.bool,
    token: PropTypes.string,
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
    if (!this.props.disableScroll && this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  isRouteForbidden(permissions) {
    const {
      path,
      auth,
      token,
    } = this.props;

    const route = routePermissions[path];

    return route && auth && token && !permissions.includes(route);
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
          {({ permission } = {}) => console.log(permission) || (
            <Choose>
              <When condition={permission && this.isRouteForbidden(permission.permissions)}>
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
