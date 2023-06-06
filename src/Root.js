import 'i18n';
import React, { Suspense, PureComponent } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ApolloProvider from 'apollo/ApolloProvider';
import AutoLogoutProvider from 'providers/AutoLogoutProvider';
import TrackifyProvider from 'providers/TrackifyProvider';
import StorageProvider from 'providers/StorageProvider';
import LocaleProvider from 'providers/LocaleProvider';
import NotificationProvider from 'providers/NotificationProvider';
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
                <NotificationProvider>
                  <ApolloProvider>
                    <TrackifyProvider>
                      <AutoLogoutProvider>
                        <App />
                      </AutoLogoutProvider>
                    </TrackifyProvider>
                  </ApolloProvider>
                </NotificationProvider>
              </LocaleProvider>
            </StorageProvider>
          </BrowserRouter>
        </CrmBrandConfigProvider>
      </Suspense>
    );
  }
}

export default Root;
