import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ApolloProvider from '../graphql/ApolloProvider';

class AppContainer extends Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  render() {
    const { routes: containerRoutes, store } = this.props;

    return (
      <Provider store={store}>
        <ApolloProvider>
          <Router>
            {containerRoutes}
          </Router>
        </ApolloProvider>
      </Provider>
    );
  }
}

export default AppContainer;
