import { applyMiddleware, compose, createStore } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { loadTranslations, syncTranslationWithStore } from 'react-redux-i18n';
import crosstabSync from 'redux-persist-crosstab';
import makeRootReducer from './reducers';
import apiUrl from '../redux/middlewares/apiUrl';
import authMiddleware from '../redux/middlewares/auth';
import apiToken from '../redux/middlewares/apiToken';
import apiErrors from '../redux/middlewares/apiErrors';
import apiVersion from '../redux/middlewares/apiVersion';
import requestTime from '../redux/middlewares/requestTime';
import catcher from '../redux/middlewares/catcher';
import { actionCreators as locationActionCreators } from '../redux/modules/location';
import { actionCreators as languageActionCreators } from '../redux/modules/language';
import unauthorized from '../redux/middlewares/unauthorized';
import config from '../config';
import translations from '../i18n';
import { actionCreators as permissionsActionCreators } from '../redux/modules/auth/permissions';

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
    const { auth, language, settings } = store.getState();

    Raven.setExtraContext({ language });
    Raven.setExtraContext({ settings });

    if (auth.logged) {
      Raven.setExtraContext({
        uuid: auth.uuid,
        brandId: auth.brandId,
        department: auth.department,
      });
    }
  });

  const persist = persistStore(store, config.middlewares.persist, async () => {
    const { auth: { logged, token } } = store.getState();
    let { language } = store.getState();

    if (!language) {
      language = config.nas.locale.defaultLanguage;
    }

    if (logged && token) {
      await store.dispatch(permissionsActionCreators.fetchPermissions(token));
    }

    syncTranslationWithStore(store);
    store.dispatch(loadTranslations(translations));
    store.dispatch(languageActionCreators.setLocale(language));

    onComplete(store);
  });

  crosstabSync(persist, config.middlewares.crossTabPersist);

  store.asyncReducers = {};
  store.unsubscribeHistory = browserHistory
    .listen(locationActionCreators.updateLocation(store));

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }
};
