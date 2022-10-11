import 'i18n';
import React, { Suspense, PureComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ApolloProvider from 'apollo/ApolloProvider';
import TrackifyProvider from 'providers/TrackifyProvider';
import StorageProvider from 'providers/StorageProvider';
import LocaleProvider from 'providers/LocaleProvider';
import CrmBrandConfigProvider from 'providers/CrmBrandProvider';
import App from './App';

class Root extends PureComponent {
  render() {
    return (
      <Suspense fallback={null}>
        <CrmBrandConfigProvider>
          <BrowserRouter>
            <StorageProvider>
              <LocaleProvider>
                <ApolloProvider>
                  <TrackifyProvider>
                    <App />
                  </TrackifyProvider>
                </ApolloProvider>
              </LocaleProvider>
            </StorageProvider>
          </BrowserRouter>
        </CrmBrandConfigProvider>
      </Suspense>
    );
  }
}

export default Root;
