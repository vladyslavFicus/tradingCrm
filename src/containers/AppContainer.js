import React, { Component, PropTypes } from 'react';
import { applyRouterMiddleware, browserHistory, Router } from 'react-router';
import { useScroll } from 'react-router-scroll';
import { Provider } from 'react-redux';

class AppContainer extends Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  render() {
    const { routes, store } = this.props;

    return (
      <Provider store={store}>
        <Router
          history={browserHistory}
          children={routes}
          render={applyRouterMiddleware(useScroll((prevRouterProps, { location }) => (
            prevRouterProps && location.pathname !== prevRouterProps.location.pathname
          )))}
        />
      </Provider>
    );
  }
}

export default AppContainer;
