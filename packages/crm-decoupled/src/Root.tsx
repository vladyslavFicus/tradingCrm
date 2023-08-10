import 'i18n';
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  ApolloProvider,
  TrackifyProvider,
  StorageProvider,
  CrmBrandProvider,
  LocaleProvider,
  NotificationProvider,
} from '@crm/common';

import App from './App';

const Root = () => (
  <Suspense fallback={null}>
    <BrowserRouter>
      <CrmBrandProvider>
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
      </CrmBrandProvider>
    </BrowserRouter>
  </Suspense>
);

export default React.memo(Root);
