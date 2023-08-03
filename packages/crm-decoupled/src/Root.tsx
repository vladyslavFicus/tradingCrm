import 'i18n';
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ApolloProvider from 'apollo/ApolloProvider';
import TrackifyProvider from 'providers/TrackifyProvider';
import StorageProvider from 'providers/StorageProvider';
import LocaleProvider from 'providers/LocaleProvider';
import NotificationProvider from 'providers/NotificationProvider';
import CrmBrandConfigProvider from 'providers/CrmBrandProvider';
import App from './App';

const Root = () => (
  <Suspense fallback={null}>
    <BrowserRouter>
      <CrmBrandConfigProvider>
        <StorageProvider>
          <LocaleProvider>
            <NotificationProvider>
              <ApolloProvider>
                <TrackifyProvider>
                  <App />
                </TrackifyProvider>
              </ApolloProvider>
            </NotificationProvider>
          </LocaleProvider>
        </StorageProvider>
      </CrmBrandConfigProvider>
    </BrowserRouter>
  </Suspense>
);

export default React.memo(Root);
