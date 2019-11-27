import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import TokenRenew from '../components/TokenRenew';
import PermissionProvider from '../providers/PermissionsProvider';
import LocalStorageListener from '../providers/LocalStorageListener';
import StorageProvider from '../providers/StorageProvider';
import ApolloProvider from '../graphql/ApolloProvider';
import history from '../router/history';
import Route from '../router/Route/Route';
import routesConfig from '../config/routes';

Route.config = routesConfig;

class AppContainer extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  render() {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <StorageProvider>
          <PermissionProvider>
            <ApolloProvider>
              <TokenRenew>
                <Router history={history}>
                  <LocalStorageListener />
                </Router>
              </TokenRenew>
            </ApolloProvider>
          </PermissionProvider>
        </StorageProvider>
      </Provider>
    );
  }
}

export default AppContainer;
