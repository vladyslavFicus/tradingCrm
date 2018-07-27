import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ApolloProvider from '../graphql/ApolloProvider';
import IndexRoute from '../routes/IndexRoute';
import history from '../router/history';
import Route from '../router/Route/Route';
import routesConfig from '../config/routes';

Route.config = routesConfig;

const AppContainer = ({ store }) => (
  <Provider store={store}>
    <ApolloProvider>
      <Router history={history}>
        <IndexRoute />
      </Router>
    </ApolloProvider>
  </Provider>
);

AppContainer.propTypes = {
  store: PropTypes.object.isRequired,
};

export default AppContainer;
