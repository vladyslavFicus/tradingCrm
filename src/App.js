import React, { Suspense, PureComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ApolloProvider from 'apollo/ApolloProvider';
import StorageProvider from 'providers/StorageProvider';
import Root from './Root';

class App extends PureComponent {
  render() {
    return (
      <Suspense fallback={null}>
        <BrowserRouter>
          <StorageProvider>
            <ApolloProvider>
              <Root />
            </ApolloProvider>
          </StorageProvider>
        </BrowserRouter>
      </Suspense>
    );
  }
}

export default App;
