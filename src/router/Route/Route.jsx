import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route as DomRoute, matchPath, withRouter, Redirect } from 'react-router-dom';

class Route extends Component {
  static propTypes = {
    disableScroll: PropTypes.bool,
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
  };

  static defaultProps = {
    path: undefined,
    disableScroll: false,
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


  render() {
    const {
      disableScroll, checkAuth, logged, ...props
    } = this.props;

    if (checkAuth && !logged) {
      return <Redirect to="/sign-in" />;
    }

    return <DomRoute {...props} />;
  }
}

export default withRouter(connect(({ auth: { logged } }) => ({ logged }))(Route));
