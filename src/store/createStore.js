import { applyMiddleware, compose, createStore } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { loadTranslations, syncTranslationWithStore } from 'react-redux-i18n';
import crosstabSync from 'redux-persist-crosstab';
import * as Sentry from '@sentry/browser';
import makeRootReducer from './reducers';
import apiUrl from '../redux/middlewares/apiUrl';
import authMiddleware from '../redux/middlewares/auth';
import apiToken from '../redux/middlewares/apiToken';
import apiErrors from '../redux/middlewares/apiErrors';
import apiVersion from '../redux/middlewares/apiVersion';
import requestTime from '../redux/middlewares/requestTime';
import catcher from '../redux/middlewares/catcher';
import { actionCreators as languageActionCreators } from '../redux/modules/language';
import unauthorized from '../redux/middlewares/unauthorized';
import config from '../config';
import translations from '../i18n';
import { actionCreators as permissionsActionCreators } from '../redux/modules/auth/permissions';
import { actionCreators as userPanelsActionCreators } from '../redux/modules/user-panels';
import history from '../router/history';

const __DEV__ = process.env.NODE_ENV === 'development';

export default (initialState = {}, onComplete) => {
  const middleware = [
    thunk,
    apiUrl,
    catcher,
    apiToken,
  ];

  middleware.push(
    apiMiddleware,
    unauthorized(config.middlewares.unauthorized),
  );

  if (window.isFrame) {
    middleware.push(require('../redux/middlewares/window').default);
  }

  middleware.push(
    authMiddleware,
    apiErrors,
    apiVersion,
    requestTime
  );

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [autoRehydrate()];
  let composeEnhancers = compose;

  if (__DEV__) {
    const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension;
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
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
    let { language } = store.getState();

    if (!language) {
      language = 'en';
    }

    if (logged && token) {
      await store.dispatch(permissionsActionCreators.fetchPermissions(token));
    }

    if (!window.isFrame) {
      history.listen(() => {
        if (store.getState().userPanels.activeIndex) {
          store.dispatch(userPanelsActionCreators.setActive(null));
        }
      });
    }

    syncTranslationWithStore(store);
    store.dispatch(loadTranslations(translations));
    store.dispatch(languageActionCreators.setLocale(language));

    onComplete(store);
  });

  crosstabSync(
    persist,
    window.isFrame ? config.middlewares.crossTabPersistFrame : config.middlewares.crossTabPersistPage
  );

  store.asyncReducers = {};

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }
};
