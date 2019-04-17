import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route as DomRoute, matchPath, Redirect } from 'react-router-dom';
import Forbidden from 'routes/Forbidden';
import Permissions from 'utils/permissions';

class Route extends Component {
  static propTypes = {
    disableScroll: PropTypes.bool,
    logged: PropTypes.bool.isRequired,
    checkAuth: PropTypes.bool,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    checkService: PropTypes.func.isRequired,
    path: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        to: PropTypes.string,
        state: PropTypes.object,
        query: PropTypes.object,
        search: PropTypes.string,
      }),
    ]),
    permissions: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    path: undefined,
    disableScroll: false,
    permissions: [],
    checkAuth: false,
  };

  static config = {};

  async componentDidMount() {
    const {
      location,
      path,
      history,
    } = this.props;

    if (matchPath(location.pathname, { path, exact: true })) {
      const isModal = location.state && location.state.modal;
      const isActionPop = (location.state && location.state.action === 'POP') || history.action !== 'POP';

      if (!isModal && !isActionPop) {
        window.scrollTo(0, 0);
      }
    }
  }

  async componentWillUpdate({ location: nextLocation, path, history }) {
    const {
      disableScroll,
      location: {
        pathname: currentPathname,
      },
    } = this.props;

    if (nextLocation.pathname !== currentPathname && !!matchPath(nextLocation.pathname, {
      path,
      exact: true,
    })) {
      const isModal = nextLocation.state && nextLocation.state.modal;
      const isActionPop = (nextLocation.state && nextLocation.state.action === 'POP') || history.action === 'POP';

      if (!disableScroll && !isModal && !isActionPop) {
        window.scrollTo(0, 0);
      }
    }
  }

  get isValidPermissions() {
    const {
      path,
      permissions,
    } = this.props;

    const currentRoutePermissions = Route.config.routePermissions[path];

    return !currentRoutePermissions || new Permissions(currentRoutePermissions).check(permissions);
  }

  get isValidAuthority() {
    const {
      excludeAuthorities,
      authority,
    } = this.props;

    if (Array.isArray(excludeAuthorities) && excludeAuthorities.length) {
      return !excludeAuthorities.some(({ department, role }) => (
        (department === authority.department) && (role === authority.role)
      ));
    }

    return true;
  }

  get routeService() {
    const { path } = this.props;

    return Route.config.routeServices[path];
  }

  render() {
    const {
      disableScroll,
      checkAuth,
      logged,
      checkService,
      ...props
    } = this.props;

    if (!this.isValidPermissions || !this.isValidAuthority) {
      return <Forbidden />;
    }

    if (checkAuth && !logged) {
      return <Redirect to={{ pathname: '/sign-in', search: `returnUrl=${props.location.pathname}` }} />;
    }

    if (this.routeService && !checkService(this.routeService)) {
      return <Redirect to="/not-found" />;
    }

    return <DomRoute {...props} />;
  }
}

export default Route;
