import React, { Suspense, PureComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import ApolloProvider from 'apollo/ApolloProvider';
import StorageProvider from 'providers/StorageProvider';
import LocalStorageListener from 'providers/LocalStorageListener';

class App extends PureComponent {
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
                <LocalStorageListener />
              </ApolloProvider>
            </StorageProvider>
          </BrowserRouter>
        </Provider>
      </Suspense>
    );
  }
}

export default App;
