import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { applyRouterMiddleware, browserHistory, Router } from 'react-router';
import { useScroll } from 'react-router-scroll';
import { Provider } from 'react-redux';

class AppContainer extends Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  render() {
    const { routes: containerRoutes, store } = this.props;

    return (
      <Provider store={store}>
        <Router
          history={browserHistory}
          children={containerRoutes}
          render={applyRouterMiddleware(useScroll((prevRouterProps, { routes, location }) => {
            if (routes.some(route => route.ignoreScrollBehavior)) {
              return false;
            }

            return prevRouterProps && location.pathname !== prevRouterProps.location.pathname;
          }))}
        />
      </Provider>
    );
  }
}

export default AppContainer;
