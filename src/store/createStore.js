import { applyMiddleware, compose, createStore } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import { browserHistory } from 'react-router';
import { persistStore, autoRehydrate } from 'redux-persist';
import { loadTranslations, syncTranslationWithStore } from 'react-redux-i18n';
import makeRootReducer from './reducers';
import thunk from '../redux/middlewares/thunk';
import apiUrl from '../redux/middlewares/apiUrl';
import authMiddleware from '../redux/middlewares/auth';
import apiErrors from '../redux/middlewares/apiErrors';
import { actionCreators as locationActionCreators } from '../redux/modules/location';
import { actionCreators as languageActionCreators } from '../redux/modules/language';
import { actionCreators as permissionsActionCreators } from '../redux/modules/permissions';
import unauthorized from '../redux/middlewares/unauthorized';
import updateToken from '../redux/middlewares/updateToken';
import window from '../redux/middlewares/window';
import config from '../config/index';
import translations from '../i18n';

export default (initialState = {}, onComplete) => {
  const middleware = [
    thunk,
    apiUrl,
    updateToken({}),
    apiMiddleware,
    unauthorized(config.middlewares.unauthorized),
    authMiddleware,
    apiErrors,
    window,
  ];

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

  persistStore(store, config.middlewares.persist, () => {
    let { language } = store.getState();

    if (!language) {
      language = config.nas.locale.defaultLanguage;
    }

    syncTranslationWithStore(store);
    store.dispatch(loadTranslations(translations));
    store.dispatch(languageActionCreators.setLocale(language));

    if (store.getState().auth && store.getState().auth.logged) {
      store.dispatch(permissionsActionCreators.fetchPermissions());
    }

    onComplete(store);
  });

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
