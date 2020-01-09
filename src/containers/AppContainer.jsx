import React, { Suspense, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import TokenRenew from 'components/TokenRenew';
import LocalStorageListener from 'providers/LocalStorageListener';
import StorageProvider from 'providers/StorageProvider';
import ApolloProvider from 'graphql/ApolloProvider';

class AppContainer extends PureComponent {
  static propTypes = {
    store: PropTypes.object.isRequired,
  };

  render() {
    const { store } = this.props;

    return (
      <Suspense fallback={null}>
        <Provider store={store}>
          <BrowserRouter>
            <StorageProvider>
              <ApolloProvider>
                <TokenRenew>
                  <LocalStorageListener />
                </TokenRenew>
              </ApolloProvider>
            </StorageProvider>
          </BrowserRouter>
        </Provider>
      </Suspense>
    );
  }
}

export default AppContainer;
