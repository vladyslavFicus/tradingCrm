import { createStore } from 'redux';
import { persistStore } from 'redux-persist';
import crosstabSync from 'redux-persist-crosstab';
import * as Sentry from '@sentry/browser';
import reducers from './reducers';
import config from '../config';
import { actionCreators as permissionsActionCreators } from '../redux/modules/auth/permissions';

export default (initialState = {}, onComplete) => {
  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    reducers(),
    initialState,
  );

  store.subscribe(() => {
    const { auth } = store.getState();

    if (auth.logged) {
      // Set user scope for Sentry exceptions
      Sentry.configureScope((scope) => {
        scope.setUser({
          id: auth.uuid,
          email: auth.login,
          brand: auth.brandId,
          department: auth.department,
          role: auth.role,
        });

        scope.setTag('brand', auth.brandId);
      });
    }
  });

  const persist = persistStore(store, config.middlewares.persist, async () => {
    const { auth: { logged, token } } = store.getState();

    if (logged && token) {
      await store.dispatch(permissionsActionCreators.fetchPermissions(token));
    }

    onComplete(store);
  });

  crosstabSync(
    persist,
    window.isFrame ? config.middlewares.crossTabPersistFrame : config.middlewares.crossTabPersistPage,
  );

  store.asyncReducers = {};
};
