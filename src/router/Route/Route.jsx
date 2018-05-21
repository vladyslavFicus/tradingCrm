import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route as DomRoute, matchPath, withRouter, Redirect } from 'react-router-dom';
import Forbidden from '../../routes/Forbidden';
import Permissions from '../../utils/permissions';
import { routePermissions } from './config';

class Route extends Component {
  static propTypes = {
    disableScroll: PropTypes.bool,
    logged: PropTypes.bool.isRequired,
    checkAuth: PropTypes.bool,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
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
    const currentRoutePermissions = routePermissions[path];

    return !currentRoutePermissions || new Permissions(currentRoutePermissions).check(permissions);
  }

  render() {
    const {
      disableScroll, checkAuth, logged, ...props
    } = this.props;

    if (!this.isValidPermissions) {
      return <Forbidden />;
    }

    if (checkAuth && !logged) {
      return <Redirect to="/sign-in" />;
    }

    return <DomRoute {...props} />;
  }
}

export default withRouter(connect(({ auth: { logged }, permissions: { data: permissions } }) => ({ logged, permissions }))(Route));
